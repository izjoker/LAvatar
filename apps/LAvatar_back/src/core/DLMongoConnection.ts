
import _ from 'lodash';
import mongoose, {Connection, ConnectOptions} from 'mongoose';
import logger from '../utils/logger';
import config from '../utils/config';


const mongoConfig = config.get('databases.mongodb.lavatar');
let dailyMongoConnection: Connection;
const url = _.get(mongoConfig, 'url');

const opt: ConnectOptions = mongoConfig.config || {};


if (url) {
    logger.debug('Connect to mongo url: ' + url);
    dailyMongoConnection = mongoose.createConnection(_.get(mongoConfig, 'url'), opt);
} else {
    logger.debug('mongo url is not provided use configuration instead');
    const mongoHostname = _.get(mongoConfig, 'hostname');
    const mongoDatabase = _.get(mongoConfig, 'database');
    const mongoUser = _.get(mongoConfig, 'user');
    const mongoPass = _.get(mongoConfig, 'pass');
    const mongoURL = `mongodb://${mongoHostname}`;
    const opt: ConnectOptions = {..._.get(mongoConfig, 'opts')};

    if (mongoUser && mongoPass) {
        opt.user = mongoUser;
        opt.pass = mongoPass;
        opt.dbName = mongoDatabase;
        logger.debug(
            `Connection to mongo url with options\nurl: ${mongoURL}\noptions: ${JSON.stringify(opt, null, 4)}`,
        );
        dailyMongoConnection = mongoose.createConnection(mongoURL, opt);
    } else {
        logger.debug('Connection to mongo url with no authentication\n' + `${mongoURL}/${mongoDatabase}`);
        dailyMongoConnection = mongoose.createConnection(`${mongoURL}/${mongoDatabase}`);
    }
}

dailyMongoConnection.asPromise().then((connection) => {
    logger.info(`Mongo connection has been created: [${JSON.stringify(connection.host)}]`);
});

export default dailyMongoConnection;
