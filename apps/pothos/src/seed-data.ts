import { startupsRepository } from '@startups/repositories';

export async function seedData() {
  const db = startupsRepository;
  const tenantId = 1;
  await db.createPhase(tenantId, {
    name: 'Phase 1',
    position: 1,
    status: 'in-progress',
  });

  await db.createPhase(tenantId, {
    name: 'Phase 2',
    position: 2,
    status: 'not-started',
  });

  await db.createPhase(tenantId, {
    name: 'Phase 3',
    position: 3,
    status: 'not-started',
  });

  const phases = await db.loadPhases(tenantId);
  for (const phase of phases) {
    for (let index = 1; index < 4; index++) {
      await db.createTask(tenantId, {
        name: `Task ${index} for phase ${phase.name}`,
        phaseId: phase.id,
        status: 'unchecked',
      });
      1;
    }
  }
}
