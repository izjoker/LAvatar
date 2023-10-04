import _ from "lodash";
import logger from "../utils/logger";
import config from "../utils/config";
import { DataSource } from "typeorm";
import PriceHistoryModel from "../models/lavatar/PriceHistory.model";
import LAItem from "../models/lavatar/LAItem.model";

const dbConfig = config.get("databases.mysql.lavatar");

const AppDataSource = new DataSource({
	type: "mysql",
	driver: {},
	host: _.get(dbConfig, "hostname"),
	port: _.get(dbConfig, "port"),
	database: _.get(dbConfig, "database"),
	username: _.get(dbConfig, "user"),
	password: _.get(dbConfig, "pass"),
	synchronize: true,
	entities: [PriceHistoryModel, LAItem, "**/*.model.{js,ts}"],
});

export default AppDataSource;
