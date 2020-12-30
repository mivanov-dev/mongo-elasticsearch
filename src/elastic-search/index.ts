import { Client } from "@elastic/elasticsearch";
import { log } from '../log';

const esClient = new Client({ node: 'http://localhost:9200/', requestTimeout: 60000 });

async function run() {

    await esClient.indices.delete({ index: 'users' }, { ignore: [404] });
    await esClient.indices.refresh({ index: 'users' }, { ignore: [404] });
    await esClient.indices.create({ index: 'users' }, { ignore: [404] });

    esClient.on('request', (error, meta) => {
        if (error) {
            log.error('esClient request error');
            console.log(error);
        }
        else {
            log.info('esClient Req:')
            // console.log(meta)
        }
    });

    esClient.on('response', (error, meta) => {
        if (error) {
            log.error('esClient response error:');
            console.log(error);
        }
        else {
            log.info('esClient Res:')
            // console.log(meta);
        }
    });

    return esClient;

}

try {
    run();
} catch (error) {
    log.error('esClient run error');
    console.log(error);
}

export { esClient };

