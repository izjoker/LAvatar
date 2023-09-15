import express from "express";
import HTTP from "http";
import _ from "lodash";
import cors from "cors";
import bodyParser from "body-parser";

import packageDict from "./core/packageDict/PackageDict";
import rootRouter from "./routers/index";
import config from "./utils/config";
import logger from "./utils/logger";

import priceHistory from "./core/priceHistory/PriceHistory";
import db from "./core/dbConnection";
import AppDataSource from "./core/dbConnection";

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = "development";
}

logger.info(
	"Configuration loaded (" + (process.env.NODE_ENV || "development") + ")"
);
const app = express();

app.use(cors());

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
const server = HTTP.createServer(app);

app.use("/", rootRouter);

const port = process.env.PORT || config.get("port") || 7000;

server.listen(port);
packageDict.mainRoutine();

export default app;
