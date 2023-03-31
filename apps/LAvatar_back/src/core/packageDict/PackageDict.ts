import _ from "lodash";
import fs from "fs";
import LostarkAPI from "../lostarkAPI/LostarkAPI";
import CacheLocal from "../../cache/cache";
import config from "../../utils/config";
import logger from "../../utils/logger";
import LAItem from "../../models/lavatar/LAItem.model";

const classIdMap = JSON.parse(
	fs.readFileSync("assets/constants/classIdMap.json", "utf-8")
);
const exceptionMap = JSON.parse(
	fs.readFileSync("assets/constants/stringIdExceptionMap.json", "utf-8")
);
const partsMap = JSON.parse(
	fs.readFileSync("assets/constants/avatarPartsIdMap.json", "utf-8")
);

const normalizeWhitespaces = (str) => {
	return str.replace(/\xA0/g, " ").trim();
};
const getStringId = (idNum: number, itemName: string) => {
	if (Object.keys(exceptionMap).includes(idNum.toString())) {
		return itemName + "_" + exceptionMap[idNum];
	}

	let suffix = "";
	if (300000000 <= idNum && idNum <= 399999999) {
		const classIdentifier = idNum.toString().substr(2, 2);
		const partsIdentifier = idNum.toString()[1];
		const className = classIdMap[classIdentifier];
		const partsName = partsMap[partsIdentifier];
		suffix = "_" + className;
	}
	return itemName + suffix;
};

export class PackageDict {
	lostarkAPI: typeof LostarkAPI;
	constItems: object;
	pricedItems: object;
	dailyMinPrices: object;
	registeredIds: Number[];

	constructor() {
		this.lostarkAPI = LostarkAPI;

		this.constItems = require("./../../../assets/packageDict/packageItems_const.json");
		this.dailyMinPrices = {};
		this.pricedItems = CacheLocal.get("pricedItems") || {};
	}

	async getItems() {
		if (_.isEmpty(this.pricedItems)) {
			console.log("returning constItems");
			return this.constItems;
		} else {
			console.log("returning pricedItems");
			return this.pricedItems;
		}
	}
	async mainRoutine() {
		// 60분마다 LostarkAPI에 요청하여 가격정보 획득 - 파일, 캐시로 출력
		try {
			this.registeredIds = await LAItem.getAllIdNums();
			const prices = await this.getItemPriceData();
			this.pricedItems["datas"] = await this.assignmentItems(
				this.constItems["datas"],
				prices
			);
			this.pricedItems["updatedAt"] = new Date().toJSON();

			// 캐시입력
			CacheLocal.set("pricedItems", this.pricedItems);
		} catch (e) {
			console.log(e);
			console.log(
				`Failed to receive Priced item datas. will retry after ${
					config.get("lostarkAPI.reqDelay") / 1000
				}s.`
			);
			setTimeout(
				() => this.mainRoutine(),
				config.get("lostarkAPI.reqDelay")
			);
			return;
		}

		setTimeout(
			() => this.mainRoutine(),
			config.get("packageDict.routineInterval")
		);
	}

	async assignmentItems(constItems: object, itemsWithPrice: object) {
		const r = constItems;
		for (const id in itemsWithPrice) {
			if ({}.hasOwnProperty.call(itemsWithPrice, id)) {
				try {
					r[id] = Object.assign(constItems[id], itemsWithPrice[id]);
				} catch (e) {
					// console.log(`no Data for this id: ${id}`);
				}
			}
		}
		return r;
	}

	async assignmentItems_debug(constItems: object, itemsWithPrice: object) {
		const r1 = constItems;
		const r2 = {};
		for (let id in itemsWithPrice) {
			if ({}.hasOwnProperty.call(itemsWithPrice, id)) {
				id = id.normalize("NFC");
				try {
					r1[id] = Object.assign(constItems[id], itemsWithPrice[id]);
				} catch (e) {
					r2[id] = itemsWithPrice[id]["id_num"];
				}
			}
		}
		return { mergedItems: r1, rests: r2 };
	}

	async getBulkMarketItemList(categoryCodes) {
		let data = [];
		for (const code of categoryCodes) {
			let page = 1;

			while (true) {
				try {
					const lastResp = await this.lostarkAPI.getMarketItemList(
						code,
						page
					);
					data = data.concat(lastResp["Items"]);
					this.setDailyMinPrice(lastResp["Items"]);
					if (lastResp["Items"].length === 0) {
						break;
					} else {
						page++;
					}
				} catch (e) {
					console.log(e);
					throw "Failed to get data from Lostark API";
				}
			}
		}

		return data;
	}

	async digestMarketItemList(marketItemListResp) {
		return marketItemListResp.reduce((acc, v) => {
			const itemName = normalizeWhitespaces(v["Name"]);
			const stringId = getStringId(v["Id"], itemName);

			if (acc[stringId] === undefined) {
				acc[stringId] = {
					id: stringId,
					idNum: v["Id"],
					name: itemName,
					icon: v["Icon"],
					grade: v["Grade"],
				};
			}
			if (v["TradeRemainCount"] === null) {
				acc[stringId]["TradeCount"] = false;
				acc[stringId]["CurrentMinPrice"] = v["CurrentMinPrice"];
				acc[stringId]["yDayAvgPrice"] = v["YDayAvgPrice"];
			} else {
				acc[stringId]["TradeCount"] = true;
				for (let i = 0; i < 4; i++) {
					if (i === v["TradeRemainCount"]) {
						acc[stringId][`CurrentMinPrice_${i}`] =
							v["CurrentMinPrice"];
						acc[stringId][`yDayAvgPrice_${i}`] = v["YDayAvgPrice"];
					}
				}
			}
			return acc;
		}, {});
	}

	async setDailyMinPrice(itemLst: Array<Object>) {
		for (const itemObj of itemLst) {
			const trc = itemObj["TradeRemainCount"] || 0;
			if (!this.dailyMinPrices[`${itemObj["Id"]}`]) {
				this.dailyMinPrices[`${itemObj["Id"]}`] = {};
			}
			if (this.dailyMinPrices[`${itemObj["Id"]}`][`sale_price_${trc}`]) {
				this.dailyMinPrices[`${itemObj["Id"]}`][`sale_price_${trc}`] =
					Math.min(
						itemObj["CurrentMinPrice"],
						this.dailyMinPrices[`${itemObj["Id"]}`][
							`sale_price_${trc}`
						]
					);
			} else {
				this.dailyMinPrices[`${itemObj["Id"]}`][`sale_price_${trc}`] =
					itemObj["CurrentMinPrice"];
			}
		}
	}

	async registerIds(rawItems) {
		for (const rawItem of rawItems) {
			if (!this.registeredIds.includes(rawItem["Id"])) {
				let row = new LAItem();
				row.id = getStringId(rawItem["Id"], rawItem["Name"]);
				row.id_num = rawItem["Id"];
				row.icon = rawItem["Icon"];
				row.trade_count = rawItem["TradeCount"];
				row.name = rawItem["Name"];
				LAItem.addRow(row);
			}
		}
	}
	async getItemPriceData() {
		/*
            주요 아이템 카테고리 코드
            아바타(상자포함, 무기, 악기포함): 20000
            펫(상자포함): 140000
            탈것(상자포함): 160000
        */
		console.log("Getting Price Datas.");
		const categoryCodes = [160000, 140000, 20000];
		const lists = await this.getBulkMarketItemList(categoryCodes);
		const digested = await this.digestMarketItemList(lists);
		CacheLocal.set("dailyMinPrices", this.dailyMinPrices);
		await this.registerIds(lists);
		console.log("Price Datas Received.");

		return digested;
	}
}

const packageDict = new PackageDict();

export default packageDict;
