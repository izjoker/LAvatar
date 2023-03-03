import _ from "lodash";
import fs from "fs";
import LostarkAPI from "../lostarkAPI/LostarkAPI";
import CacheLocal from "../../cache/cache";
import config from "../../utils/config";
import LAItem from "../../models/lavatar/LAItem.model";
import AppDataSource from "../dbConnection";
import logger from "../../utils/logger";

export class PriceHistory {
	lostarkAPI: typeof LostarkAPI;
	constItems: object;
	pricedItems: object;

	constructor() {
		this.lostarkAPI = LostarkAPI;
	}
	async mainRoutine() {
		let idNums = [];
		await AppDataSource.initialize()
			.then(async () => {
				console.log("Data Source has been initialized!");
				idNums = await LAItem.getAllIdNums();
			})
			.catch((err) => {
				console.error("Error during Data Source initialization", err);
			});
		try {
			this.getPriceDatas(idNums);
		} catch {
			logger.info("Failed to get Price Datas");
		}
		return;
	}

	async getPriceDatas(idNums: Array<Number>) {
		for (let idNum of idNums) {
			let v = await this.lostarkAPI.getMarketItem(idNum);
			// console.log("v: ", v);
			console.log(this.digestRawData(v));
		}
	}

	async digestRawData(rawData: Array<Object>) {
		let r = {};

		for (const [i, v] of rawData.entries()) {
			if (v["TradeRemainCount"] === null) {
				r["tradeCount"] = false;
			} else {
				r["tradeCount"] = true;
			}
			r["name"] = v["Name"];
			r[`date`] = v["Stats"][1]["Date"];
			r[`dealt_price_${i}`] = v["Stats"][1]["AvgPrice"];
			r[`volume_${i}`] = v["Stats"][1]["TradeCount"];
		}
		return r;
	}
}

const priceHistory = new PriceHistory();

export default priceHistory;
