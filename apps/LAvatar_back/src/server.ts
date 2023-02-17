import express from 'express';
import HTTP from 'http';
import _ from 'lodash';
import cors from 'cors';
import bodyParser from 'body-parser';

import packageDict from './models/lavatar/PackageDict.model';
import rootRouter from './routers/index';
import config from './utils/config';
import logger from './utils/logger';


if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

logger.info(
    'Configuration loaded (' + (process.env.NODE_ENV || 'development') + ')\n' + JSON.stringify(config.get(), null, 2));
const app = express();

packageDict.mainRoutine();
app.use(cors());

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
const server = HTTP.createServer(app);

app.use('/', rootRouter);

const port = process.env.PORT || config.get('port') || 7000;
console.log('port:', port)

server.listen(port);

export default app;
