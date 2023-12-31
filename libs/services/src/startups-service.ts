import {
  IStartupsRepository,
  PhaseData,
  TaskData,
  TaskStatus,
} from '@startups/repositories';
import { error } from 'console';

export class StartupsService {
  constructor(
    private repository: IStartupsRepository,
    private tenantId: number
  ) {}

  async loadPhases() {
    return this.repository.loadPhases(this.tenantId);
  }

  async loadPhase(phaseId: number) {
    return this.repository.loadPhase(this.tenantId, phaseId);
  }

  async loadPhaseTasks(phaseId: number) {
    return this.repository.loadTasks(this.tenantId, phaseId);
  }

  async createPhase(data: PhaseData) {
    return this.repository.createPhase(this.tenantId, data);
  }

  async createTask(data: TaskData) {
    return this.repository.createTask(this.tenantId, data);
  }

  /**
   * Toggles the task status
   * @param taskId
   * @returns
   */
  async toggleTask(taskId: number) {
    const task = await this.repository.loadTask(this.tenantId, taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    const taskPhase = await this.repository.loadPhase(
      this.tenantId,
      task.phaseId
    );
    if (!taskPhase) {
      throw new Error(`Phase for the task ${taskId} not found`);
    }
    if (taskPhase.status !== 'in-progress') {
      throw new Error(
        `Cannot update task status for phase in ${taskPhase.status} status`
      );
    }

    const newStatus: TaskStatus =
      task.status === 'checked' ? 'unchecked' : 'checked';
    await this.repository.updateTaskStatus(this.tenantId, taskId, newStatus);
    if (newStatus === 'checked') {
      const phaseTasks = await this.repository.loadTasks(
        this.tenantId,
        task.phaseId
      );
      const allTasksChecked = phaseTasks.every((t) => t.status === 'checked');
      if (allTasksChecked) {
        await this.repository.updatePhaseStatus(
          this.tenantId,
          task.phaseId,
          'completed'
        );
      }
    }
  }

  /**
   * Unlocks (set state to in-progress) a phase
   * @param taskId
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async unlockPhase(phaseId: number) {
    // TODO: load all phases
    // set in-progress status for the found phase and not-started status for the following stages
    // uncheck all task for the found phase and for the following stages
    const phases = await this.repository.loadPhases(this.tenantId);
    const currentPhase = phases.find((p) => p.id === phaseId);
    if (!currentPhase) {
      throw new Error(`Phase ${phaseId} not found`);
    }
    const isFirst = currentPhase.position === 1;
    if (isFirst) {
      await this.processPhaseUnlock(phaseId);
    }
    const prevPhase = phases.find(
      (p) => (p.position = currentPhase.position - 1)
    );

    if (prevPhase?.status !== 'completed') {
      throw new Error(
        `Cannot unlock phase '${currentPhase.name}' as previous phase '${prevPhase?.name}' is not completed [${prevPhase?.status}]`
      );
    }
    const nextPhases = phases.filter((p) => p.position > currentPhase.position);

    await this.processPhaseUnlock(phaseId);
    for (const phase of nextPhases) {
      await this.processPhaseUnlock(phase.id);
    }
  }

  private async processPhaseUnlock(phaseId: number) {
    await this.repository.updatePhaseStatus(
      this.tenantId,
      phaseId,
      'in-progress'
    );
    const phaseTasks = await this.loadPhaseTasks(phaseId);

    // FIXME: rewrite repo to enable mass update
    for (const task of phaseTasks) {
      await this.repository.updateTaskStatus(
        this.tenantId,
        task.id,
        'unchecked'
      );
    }
  }
}
