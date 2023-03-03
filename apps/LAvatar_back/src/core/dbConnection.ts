import _ from "lodash";
import mysql, { Connection } from "mysql";
import logger from "../utils/logger";
import config from "../utils/config";
import { DataSource } from "typeorm";
import LAItem from "../models/lavatar/LAItem.model";

const dbConfig = config.get("databases.mysql.lavatar");

const AppDataSource = new DataSource({
	type: "mysql",
	host: _.get(dbConfig, "hostname"),
	port: _.get(dbConfig, "port"),
	database: _.get(dbConfig, "database"),
	username: _.get(dbConfig, "user"),
	password: _.get(dbConfig, "pass"),
	entities: ["**/*.model.{js,ts}"],
});
export default AppDataSource;
