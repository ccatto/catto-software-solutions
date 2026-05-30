// apps/backend/src/graphql/graphql-context.module.ts
import { Module } from '@nestjs/common';
import { GraphqlContextService } from './graphql-context.service';

@Module({
  imports: [
    // Add feature modules here as needed for DataLoaders
  ],
  providers: [GraphqlContextService],
  exports: [GraphqlContextService],
})
export class GraphqlContextModule {}
