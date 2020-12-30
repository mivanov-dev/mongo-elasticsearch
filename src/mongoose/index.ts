import faker from 'faker';
import mongoose from "mongoose";
import { log } from "../log";
import { User } from './models/user';

mongoose.Promise = global.Promise;
mongoose.set('debug', false);

const connection = mongoose.connection;

function database(uri: string, options: any) {

    connection.on('open', async () => {

        connection
          .dropDatabase((error) => log.info('mongoose drop database'));

        await dropModels();

        // await initData(10);

      });
      connection.on('connected', () => log.info('mongoose connected'));
      connection.on('connecting', () => log.info('mongoose connecting'));
      connection.on('error', (error) => log.info('mongoose error'));
      connection.on('disconnected', () => log.info('mongoose:disconnected'));

      mongoose.connect(uri, options);

}

async function dropModels() {

    const dbModels = [User];

    try {

      for (const model of dbModels) {

        const list = await model.db.db.listCollections({
          name: model.name
        }).toArray();

        if (list.length !== 0) {
          await model.collection.drop();
        } else {
          log.info(`mongoose dropModels: collection ${model.collection.name} does not exist`);
        }
      }

    }
    catch (error) {
      log.info(`mongoose dropModels: ${JSON.stringify(error, null, '\t')}`);
    }

  }

  async function initData(count: number) {

    for (let i = 0; i < count; i++) {
      await new User({
        email: faker.internet.email(),
        password: faker.internet.password(10),
        locale: faker.random.locale()
      }).save();
    }

  }

export { database };

