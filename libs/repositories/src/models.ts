export type PhaseStatus = 'completed' | 'in-progress' | 'not-started';
export type TaskStatus = 'checked' | 'unchecked';

export interface PhaseModel {
  id: number;
  name: string;
  position: number;
  tenantId: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface TaskModel {
  id: number;
  name: string;
  tenantId: number;
  phaseId: number;
  status: TaskStatus;
}

export interface TenantModel {
  id: number;
  name: string;
}
