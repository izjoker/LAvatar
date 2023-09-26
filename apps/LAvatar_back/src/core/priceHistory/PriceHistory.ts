import _ from "lodash";
import fs from "fs";
import LostarkAPI from "../lostarkAPI/LostarkAPI";
import CacheLocal from "../../cache/cache";
import config from "../../utils/config";
import LAItem from "../../models/lavatar/LAItem.model";
import AppDataSource from "../dbConnection";
import logger from "../../utils/logger";
import PriceHistoryModel from "../../models/lavatar/PriceHistory.model";
import { sleep, convertMsToTime } from "../../utils/utils";

export class PriceHistory {
	lostarkAPI: typeof LostarkAPI;
	constItems: object;
	pricedItems: object;

	constructor() {
		this.lostarkAPI = LostarkAPI;
	}
	async mainRoutine() {
		while (true) {
			const dailyMinPrices: Object[] = CacheLocal.get("dailyMinPrices");
			if (!dailyMinPrices) {
				console.log("there no exist reserved Min Prices");
				await sleep(60000);
				continue;
			}
			const idNums = await LAItem.getAllIdNums();
			try {
				for (let idNum of idNums) {
					let rawData = await this.lostarkAPI.getMarketItem(idNum);
					PriceHistoryModel.addRow(
						await this.createRow(dailyMinPrices, rawData, idNum)
					);
				}
			} catch {
				logger.info("Failed to get Price Datas");
			}

			await sleep(6 * 60 * 60 * 1000);
		}
	}

	async getPriceDatas(idNums: Array<Number>) {
		const dailyMinPrices: Object[] = CacheLocal.get("dailyMinPrices");
	}
	async createRow(
		dailyMinPrices: Object[],
		rawData: Object[],
		idNum: Number
	) {
		let newRow = new PriceHistoryModel();
		newRow["idNum"] = idNum;
		const digested = await this.digestRawData(rawData);

		for (const key in digested) {
			newRow[key] = digested[key];
		}
		for (const key in dailyMinPrices[idNum.toString()]) {
			newRow[key] = dailyMinPrices[idNum.toString()][key];
		}
		return newRow;
	}

	async digestRawData(rawData: Array<Object>) {
		let r: Object = {};
		for (const [i, v] of rawData.entries()) {
			if (v["TradeRemainCount"] === null) {
				r["tradeCount"] = false;
			} else {
				r["tradeCount"] = true;
			}
			r[`date`] = v["Stats"][1]["Date"];
			r[`dealt_price_${i}`] =
				v["Stats"][1]["AvgPrice"] !== 0
					? v["Stats"][1]["AvgPrice"]
					: null;
			r[`volume_${i}`] = v["Stats"][1]["TradeCount"];
		}
		return r;
	}
	async getItemPrice(itemId: String) {}
}

const priceHistory = new PriceHistory();

export default priceHistory;
