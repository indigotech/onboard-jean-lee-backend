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

- Make sure the node version from `.nvmrc` is being used.

- Install dependencies.

```
npm install
```

- Create and start local databases. This requires a [Docker environment](https://docs.docker.com/compose/install/) set up.
```
docker-compose up -d
```

- Execute the server.
```
npm run start
```
