// apps/backend/src/modules/users/users.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, WhereUserInput } from './dto/user.dto';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(
    @Args('where', { nullable: true }) where?: WhereUserInput,
  ): Promise<User[]> {
    return this.usersService.findAll(where);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('where') where: WhereUserInput): Promise<User> {
    return this.usersService.findOne(where);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('platform_admin')
  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.usersService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
    return this.usersService.update(data.id, data);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('platform_admin')
  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
