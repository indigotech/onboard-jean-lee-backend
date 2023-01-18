import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { initializeApolloServer } from './server';

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Jean';
    user.lastName = 'Lee';
    user.age = 23;
    await AppDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    await initializeApolloServer();
  })
  .catch((error) => console.log(error));
