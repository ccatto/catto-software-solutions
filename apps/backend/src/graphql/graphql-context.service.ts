// apps/backend/src/graphql/graphql-context.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GraphqlContextService {
  /**
   * Create the GraphQL context for each request.
   * Add DataLoaders and other per-request services here.
   */
  createContext(req: Request) {
    return {
      req,
      // Add DataLoaders here as your app grows, e.g.:
      // usersLoader: createUsersLoader(this.usersService),
    };
  }
}
