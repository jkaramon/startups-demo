import { TaskModel, PhaseModel, TaskStatus, PhaseStatus } from './models';

export type TaskData = Omit<TaskModel, 'id' | 'tenantId'>;
export type PhaseData = Omit<PhaseModel, 'id' | 'tenantId'>;

export interface IStartupsRepository {
  clearDB: () => Promise<void>;
  loadPhases: (tenantId: number) => Promise<PhaseModel[]>;
  loadTasks: (tenantId: number, phaseId?: number) => Promise<TaskModel[]>;
  loadTask: (tenantId: number, taskId: number) => Promise<TaskModel | null>;
  loadPhase: (tenantId: number, phaseId: number) => Promise<PhaseModel | null>;
  createPhase: (tenantId: number, phase: PhaseData) => Promise<void>;
  createTask: (tenantId: number, task: TaskData) => Promise<void>;
  updateTaskStatus: (
    tenantId: number,
    taskId: number,
    taskStatus: TaskStatus
  ) => Promise<void>;
  updatePhaseStatus: (
    tenantId: number,
    phaseId: number,
    phaseStatus: PhaseStatus
  ) => Promise<void>;
}
