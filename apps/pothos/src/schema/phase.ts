import { builder } from './builder';

builder.objectType('Phase', {
  description: 'A startup phase',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    position: t.exposeInt('position'),
    tenantId: t.exposeID('tenantId'),
    status: t.exposeString('status'),
    tasks: t.field({
      type: ['Task'],
      resolve: async (parent, args, ctx) => {
        return ctx.svc.loadPhaseTasks(parent.id);
      },
    }),
  }),
});

builder.queryFields((t) => ({
  phases: t.field({
    type: ['Phase'],
    resolve: async (parent, args, ctx) => {
      return ctx.svc.loadPhases();
    },
  }),
}));

builder.mutationFields((t) => ({
  toggleTask: t.field({
    args: {
      taskId: t.arg.int(),
    },
    type: 'String',
    resolve: async (parent, args, ctx) => {
      await ctx.svc.toggleTask(args.taskId ?? -1);
      return 'OK';
    },
  }),
}));
