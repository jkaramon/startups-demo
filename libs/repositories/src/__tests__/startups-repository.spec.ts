import { PhaseModel } from '../models';
import { startupsRepository as repo } from '../startups-repository';
describe('Startups repository', () => {
  describe('loadTasks', () => {
    beforeEach(async () => {
      await repo.clearDB();
      await repo.createPhase(1, {
        name: 'phase 1',
        position: 1,
        status: 'in-progress',
      });
    });
    it('should return empty array if no task created', async () => {
      const tasks = await repo.loadTasks(1);
      expect(tasks).toHaveLength(0);
    });

    it('should return all tasks created', async () => {
      await repo.createTask(1, {
        name: 'task 1',
        status: 'unchecked',
        phaseId: 1,
      });
      await repo.createTask(1, {
        name: 'task 2',
        status: 'unchecked',
        phaseId: 1,
      });
      const tasks = await repo.loadTasks(1);
      expect(tasks).toHaveLength(2);
      expect(tasks[0]).toMatchObject({ id: 1, name: 'task 1', tenantId: 1 });
      expect(tasks[1]).toMatchObject({ id: 2, name: 'task 2', tenantId: 1 });
    });

    it('should return tasks for each tenant', async () => {
      await repo.createTask(1, {
        name: 'task 1',
        status: 'unchecked',
        phaseId: 1,
      });
      const tasksTenant1 = await repo.loadTasks(1);
      expect(tasksTenant1).toHaveLength(1);
      const tasksTenant2 = await repo.loadTasks(2);
      expect(tasksTenant2).toHaveLength(0);
    });
  });

  describe('loadPhases', () => {
    beforeEach(async () => {
      await repo.clearDB();
    });
    it('should return empty array if no phase created', async () => {
      const phases = await repo.loadPhases(1);
      expect(phases).toHaveLength(0);
    });

    it('should return all phases created', async () => {
      await repo.createPhase(1, {
        name: 'phase 1',
        status: 'in-progress',
        position: 1,
      });
      const phases = await repo.loadPhases(1);
      expect(phases).toHaveLength(1);
      expect(phases[0]).toMatchObject({
        id: 1,
        name: 'phase 1',
        position: 1,
        status: 'in-progress',
        tenantId: 1,
      } as PhaseModel);
    });
  });
});
