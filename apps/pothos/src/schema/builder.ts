import SchemaBuilder from '@pothos/core';
import { PothosContext } from '../context';
import { PhaseModel, TaskModel } from '@startups/repositories';

export const builder = new SchemaBuilder<{
  Objects: {
    Task: TaskModel;
    Phase: PhaseModel;
  };
  Context: PothosContext;
}>({});

builder.queryType({});
builder.mutationType({});
