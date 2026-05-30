// apps/backend/src/common/resolvers/base.resolver.ts
import { Type } from '@nestjs/common';
// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { BaseService } from '../services/base.service';

export function BaseResolver<
  T extends BaseEntity,
  CreateInput,
  UpdateInput,
  WhereInput,
>(
  classRef: Type<T>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createInputRef: Type<CreateInput>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateInputRef: Type<UpdateInput>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  whereInputRef?: Type<WhereInput>,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(
      public readonly service: BaseService<
        T,
        CreateInput,
        UpdateInput,
        WhereInput
      >,
    ) {}

    @Mutation(() => classRef, { name: `create${classRef.name}` })
    create(
      @Args('data', { type: () => createInputRef }) createInput: CreateInput,
    ) {
      return this.service.create(createInput);
    }

    // @Mutation(() => classRef, { name: `create${classRef.name}` })
    //   create(@Args('data') createInput: CreateInput) {
    //   return this.service.create(createInput);
    // }

    // @Mutation(() => classRef, { name: `create${classRef.name}` })
    // create(@Args('data') createInput: CreateInput) {
    //   return this.service.create(createInput);
    // }

    // @Query(() => [classRef], { name: `find${classRef.name}s` })
    //   findAll(@Args('where', { nullable: true, type: () => whereInputRef }) where?: WhereInput) {
    //   return this.service.findAll(where);
    // }

    // @Query(() => classRef, { name: `find${classRef.name}` })
    // findOne(@Args('id', { type: () => ID }) id: number) {
    //   return this.service.findOne(id);
    // }

    // @Mutation(() => classRef, { name: `update${classRef.name}` })
    // update(
    //   @Args('id', { type: () => ID }) id: number,
    //   @Args('data', { type: () => updateInputRef }) updateInput: UpdateInput,
    // ) {
    //   return this.service.update(id, updateInput);
    // }

    // @Mutation(() => classRef, { name: `remove${classRef.name}` })
    // remove(@Args('id', { type: () => ID }) id: number) {
    //   return this.service.remove(id);
    // }

    // @Query(() => classRef, { name: `find${classRef.name}` })
    // findOne(@Args('id', { type: () => ID }) id: string | number) {
    //   return this.service.findOne(id);
    // }

    // @Mutation(() => classRef, { name: `update${classRef.name}` })
    // update(
    //   @Args('id', { type: () => ID }) id: string | number,
    //   @Args('data', { type: () => updateInputRef }) updateInput: UpdateInput,
    // ) {
    //   return this.service.update(id, updateInput);
    // }

    // @Mutation(() => classRef, { name: `remove${classRef.name}` })
    // remove(@Args('id', { type: () => ID }) id: string | number) {
    //   return this.service.remove(id);
    // }

    // @Query(() => [classRef], { name: `find${classRef.name}s` })
    // findAll(@Args('where', { nullable: true }) where?: WhereInput) {
    //   return this.service.findAll(where);
    // }

    // @Query(() => classRef, { name: `find${classRef.name}` })
    // findOne(@Args('id') id: string | number) {
    //   return this.service.findOne(id);
    // }

    // @Mutation(() => classRef, { name: `update${classRef.name}` })
    // update(
    //   @Args('id') id: string | number,
    //   @Args('data') updateInput: UpdateInput,
    // ) {
    //   return this.service.update(id, updateInput);
    // }

    // @Mutation(() => classRef, { name: `remove${classRef.name}` })
    // remove(@Args('id') id: string | number) {
    //   return this.service.remove(id);
    // }
  }

  return BaseResolverHost;
}
