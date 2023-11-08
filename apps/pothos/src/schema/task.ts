import { PhaseModel, TaskModel } from '@startups/repositories';
import { builder } from './builder';

builder.objectType('Task', {
  description: 'A startup phase',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    status: t.exposeString('status'),
    tenantId: t.exposeID('tenantId'),
    phase: t.field({
      type: 'Phase',
      nullable: true,
      resolve: async (parent, args, ctx) => {
        return ctx.svc.loadPhase(parent.phaseId);
      },
    }),
  }),
});

builder.mutationFields((t) => ({
  unlockPhase: t.field({
    args: {
      phaseId: t.arg.int(),
    },
    type: 'String',
    resolve: async (parent, args, ctx) => {
      await ctx.svc.unlockPhase(args.phaseId ?? -1);
      return 'OK';
    },
  }),
}));
