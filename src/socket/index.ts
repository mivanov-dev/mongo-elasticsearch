import http from "http";
import socketIo from "socket.io";
import { esClient } from "../elastic-search";
import { log } from '../log';
import { User } from "../mongoose/models/user";

function socket(server: http.Server) {

    const _socket = new socketIo.Server(server);

    _socket.on('connection', (io) => {

        io.on('event', (data: any) => log.info(`io event`));

        io.on('disconnect', () => log.info('io disconnect'));

        io.on('msg', (msg: any) => {
            log.info('io msg');
            io.emit('msg', 'Ok !');
        });
        io.on('add', async (msg: any) => {
            try {
                await new User(msg).save();
                io.emit('add', 'Added user');
            } catch (error) {
                log.error('io error add');
                console.error(error)
            }
        });

        io.on('search', async (msg: any) => {
            try {
                const { body } = await esClient.search({
                    index: 'users',
                    body: {
                        query: {
                            match: {
                                email: msg
                            }
                        }
                    }
                });
                io.emit('search', body.hits.hits.map((i:any) => i._source));
            } catch (error) {
                log.error('io error search');
                console.error(JSON.stringify(error, null, '\t'))
            }
        });
    });

    return _socket;

}

export { socket };

