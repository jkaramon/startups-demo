import {
  IStartupsRepository,
  PhaseData,
  TaskData,
} from './i-startups-repository';
import { PhaseModel, PhaseStatus, TaskModel, TaskStatus } from './models';

interface DBData {
  phases: PhaseModel[];
  tasks: TaskModel[];
}

let fakeDB: Record<number, DBData> = {};

function getTenantDB(tenantId: number): DBData {
  if (!fakeDB[tenantId]) {
    fakeDB[tenantId] = {
      phases: [],
      tasks: [],
    };
  }
  return fakeDB[tenantId];
}

function findTask(db: DBData, taskId: number): TaskModel | null {
  const task = db.tasks.find((t) => t.id === taskId);
  return task ?? null;
}
function findPhase(db: DBData, phaseId: number): PhaseModel | null {
  const phase = db.phases.find((p) => p.id === phaseId);
  return phase ?? null;
}

export const startupsRepository: IStartupsRepository = {
  clearDB: async () => {
    fakeDB = {};
  },

  /**
   * Loads phases ordered by position
   * @param tenantId
   * @returns
   */
  loadPhases: async (tenantId: number) => {
    const db = getTenantDB(tenantId);
    // TODO: sort by position
    return db.phases;
  },
  loadTasks: async (tenantId: number, phaseId?: number) => {
    const db = getTenantDB(tenantId);
    if (phaseId) {
      return db.tasks.filter((t) => t.phaseId === phaseId);
    }
    return db.tasks;
  },

  createPhase: async (tenantId: number, phase: PhaseData) => {
    const db = getTenantDB(tenantId);
    const nextId = db.phases.length + 1;
    db.phases.push({ ...phase, id: nextId, tenantId } as PhaseModel);
  },
  createTask: async (tenantId: number, task: TaskData) => {
    const db = getTenantDB(tenantId);
    if (!task) {
      throw new Error(`Task ${task} not found`);
    }
    if (!findPhase(db, task.phaseId)) {
      throw new Error(`Phase ${task.phaseId} not found`);
    }
    const nextId = db.tasks.length + 1;
    db.tasks.push({ ...task, tenantId, id: nextId });
  },
  updateTaskStatus: async (
    tenantId: number,
    taskId: number,
    taskStatus: TaskStatus
  ) => {
    const db = getTenantDB(tenantId);
    const task = findTask(db, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    task.status = taskStatus;
  },
  updatePhaseStatus: async (
    tenantId: number,
    phaseId: number,
    phaseStatus: PhaseStatus
  ) => {
    const db = getTenantDB(tenantId);
    const phase = findPhase(db, phaseId);
    if (!phase) {
      throw new Error(`Phase ${phaseId} not found`);
    }
    phase.status = phaseStatus;
  },
  loadTask: async (tenantId: number, taskId: number) => {
    const db = getTenantDB(tenantId);
    return findTask(db, taskId);
  },
  loadPhase: async (tenantId: number, phaseId: number) => {
    const db = getTenantDB(tenantId);
    return findPhase(db, phaseId);
  },
};
