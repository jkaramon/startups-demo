import { StartupsService } from '@startups/services';

export interface PothosContext {
  tenantId: number;
  svc: StartupsService;
}
