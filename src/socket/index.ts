import http from "http";
import socketIo from "socket.io";
import { esClient } from "../elastic-search";
import { log } from '../log';
import { User } from "../mongoose/models/user";


const userEvent = {
    search: (io: socketIo.Socket): void => {

        io.on('search', async (msg: any) => {

            try {
                const { body } = await esClient.search({
                    index: 'users',
                    body: {
                        query: {
                            query_string: {
                                fields: ['locale'],
                                // default_field
                                query: msg
                            }
                        },
                        from: 0,
                        size: 20
                    }
                });
                io.emit('search', body.hits.hits.map((i: any) => i._source));
            } catch (error) {
                log.error('io error search');
                console.error(JSON.stringify(error, null, '\t'))
            }

        });

    },
    add: (io: socketIo.Socket): void => {

        io.on('add', async (msg: any) => {
            try {
                await new User(msg).save();
                io.emit('add', 'Added user');
            } catch (error) {
                log.error('io error add');
                console.error(error)
            }
        });

    }
};

function socket(server: http.Server) {

    const _socket = new socketIo.Server(server);

    _socket.on('connection', (io: socketIo.Socket) => {

        io.on('event', (data: any) => log.info(`io event`));

        io.on('disconnect', () => log.info('io disconnect'));

        userEvent.add(io);
        userEvent.search(io);

    });

}

export { socket };

