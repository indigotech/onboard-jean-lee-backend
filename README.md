# Onboarding Backend

Server capable of storing data in a database and CRUDing it, developed as part of the Taqtile backend onboarding.

## Environment and tools

- Node
- Typescript
- GraphQL
- ApolloServer
- TypeORM
- Docker

## Running and debugging

1. Make sure the node version from `.nvmrc` is being used.

2. Create and start local databases. This requires a [Docker environment](https://docs.docker.com/compose/install/) set up.
```
docker-compose up -d
```

3. Execute the server: 
```
npm run start
```
