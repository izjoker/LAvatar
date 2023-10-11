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
import PackageDict from "../packageDict/PackageDict";
import { Equal } from "typeorm";
export class PriceHistory {
	lostarkAPI: typeof LostarkAPI;
	constItems: object;
	pricedItems: object;

	constructor() {
		this.lostarkAPI = LostarkAPI;
	}

	async mainRoutine() {
		while (true) {
			const dailyMinPrices: Object = PackageDict.dailyMinPrices;
			if (_.isEmpty(dailyMinPrices)) {
				console.log("there no exist reserved Min Prices");
				await sleep(60000);
				continue;
			}
			const idNums = await LAItem.getAllIdNums();
			try {
				for (let idNum of idNums) {
					let rawData = await this.lostarkAPI.getMarketItem(idNum);
					console.log(rawData);
					PriceHistoryModel.addRow(
						await this.createRow(dailyMinPrices, rawData, idNum)
					);
				}
			} catch (e) {
				logger.info(`Failed to get Price Datas (${e.message})`);
				sleep(60000);
				continue;
			}

			await sleep(config.get("priceHistory.routineInterval"));
		}
	}

	async createRow(dailyMinPrices: Object, rawData: Object[], idNum: Number) {
		let cnt = 0;
		while (cnt < 5) {
			try {
				let newRow = new PriceHistoryModel();
				newRow["laitem"] = await LAItem.findOne({
					where: {
						id_num: Equal(idNum),
					},
				});
				const digested = await this.digestRawData(rawData);

				for (const key in digested) {
					newRow[key] = digested[key];
				}
				for (const key in dailyMinPrices[idNum.toString()]) {
					newRow[key] = dailyMinPrices[idNum.toString()][key];
				}
				return newRow;
			} catch {
				cnt += 1;
				sleep(3000);
			}
		}
		throw `Failed to create a Row for id:${idNum} on priceHistory`;
	}

	async digestRawData(rawData: Array<Object>) {
		let r: Object = {};
		for (const [i, v] of rawData.entries()) {
			if (v["TradeRemainCount"] === null) {
				r["trade_count"] = false;
				r[`date`] = v["Stats"][1]["Date"];
				r[`dealt_price_0`] =
					v["Stats"][1]["AvgPrice"] !== 0
						? v["Stats"][1]["AvgPrice"]
						: null;
				r[`volume_0`] = v["Stats"][1]["TradeCount"];
			} else {
				r["trade_count"] = true;
				r[`date`] = v["Stats"][1]["Date"];
				r[`dealt_price_${v["TradeRemainCount"]}`] =
					v["Stats"][1]["AvgPrice"] !== 0
						? v["Stats"][1]["AvgPrice"]
						: null;
				r[`volume_${v["TradeRemainCount"]}`] =
					v["Stats"][1]["TradeCount"];
			}
		}
		return r;
	}
	async getItemPrice(idNum: Number) {
		return await LAItem.find({
			where: {
				id_num: Equal(idNum),
			},
			relations: ["prices"],
		});
	}
}

const priceHistory = new PriceHistory();

export default priceHistory;
