import { ApolloServer } from 'apollo-server';
import { builder } from './schema/index';
import { PothosContext } from './context';
import { StartupsService } from '@startups/services';
import { startupsRepository } from '@startups/repositories';
import { seedData } from './seed-data';

function bootstrap() {
  const server = new ApolloServer({
    schema: builder.toSchema(),
    context: () => {
      const tenantId = 1;
      return {
        tenantId,
        svc: new StartupsService(startupsRepository, tenantId),
      } as PothosContext;
    },
  });
  server.listen(3000, () => {
    console.log('Visit http://localhost:3000/graphql');
  });
}

(async () => {
  await seedData();
  bootstrap();
})().catch((e) => console.error('Fatal error', e));
