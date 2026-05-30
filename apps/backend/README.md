# Backend - NestJS GraphQL API

## Tech Stack

- NestJS 11 with GraphQL (Apollo Server)
- Prisma ORM with PostgreSQL
- JWT Authentication
- TypeScript
- Jest for testing

## Getting Started

1. Copy `.env.example` to `.env` and configure your database connection
2. `yarn install`
3. `yarn prisma:generate`
4. `yarn db:push`
5. `yarn dev` (runs on port 4000)

Then open the GraphQL Playground at: http://localhost:4000/graphql

## Example Queries

```graphql
query {
  users {
    id
    email
    name
    role
  }
}

query {
  user(where: { email: "test@example.com" }) {
    id
    email
    name
  }
}
```

## Deployment

```bash
yarn deploy:backend
```
