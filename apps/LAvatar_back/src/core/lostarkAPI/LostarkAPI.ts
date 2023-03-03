import fs from "fs";
import axios from "axios";
import config from "../../utils/config";
import logger from "../../utils/logger";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class LostarkAPI {
	authTokens: Array<object>;
	currAuthToken: string;
	tokenIdx: number;
	reqCounts: Array<number>;

	constructor() {
		this.authTokens = [];
		for (let authKey of config.get(`lostarkAPI.authentication.keys`)) {
			this.authTokens.push({
				key: authKey,
				reqCount: 0,
			});
		}
		this.tokenIdx = 0;
	}
	async switchAuthToken() {
		this.tokenIdx++;
		if (this.tokenIdx > this.authTokens.length - 1) {
			this.tokenIdx = 0;
		}
	}
	async reqController() {
		let reqCount = this.authTokens[this.tokenIdx]["reqCount"]++;
		if (reqCount > 91) {
			this.switchAuthToken();
			if (this.tokenIdx === 0) {
				await sleep(config.get("lostarkAPI.reqDelay"));
				for (let tokenObj of this.authTokens) {
					tokenObj["reqCount"] = 0;
				}
			}
		}
	}
	async getMarketItemList(categoryCode, pageNum) {
		let r = {};
		let errorCount = 0;
		const url = "https://developer-lostark.game.onstove.com/markets/items";
		const body = {
			Sort: "GRADE",
			CategoryCode: categoryCode,
			ItemGrade: null,
			ItemName: null,
			PageNo: pageNum,
			SortCondition: "ASC",
		};
		while (true) {
			try {
				await this.reqController();
				const resp = await axios.request({
					url: url,
					method: "post",
					data: body,
					headers: {
						authorization: `bearer ${
							this.authTokens[this.tokenIdx]["key"]
						}`,
					},
					timeout: 5000,
				});
				r = resp.data;
				break;
			} catch (e) {
				if (errorCount > 5) {
					throw "Failed to get data from Lostark API";
				} else {
					logger.info(`Failed to request. Retrying.. (${e.message})`);
					errorCount++;
					this.switchAuthToken();
					sleep(2000);
				}
			}
		}

		return r;
	}

	async getMarketItem(idNum: Number) {
		let r: Array<Object>;
		const url = `https://developer-lostark.game.onstove.com/markets/items/${idNum}`;
		let errorCount = 0;

		while (true) {
			try {
				await this.reqController();
				const resp = await axios.get(url, {
					headers: {
						authorization: `bearer ${
							this.authTokens[this.tokenIdx]["key"]
						}`,
					},
					timeout: 5000,
				});
				r = resp.data;
				break;
			} catch (e) {
				if (errorCount > 5) {
					throw "Failed to get data from Lostark API";
				} else {
					logger.info(`Failed to request. Retrying.. (${e.message})`);
					errorCount++;
					this.switchAuthToken();
					sleep(2000);
				}
			}
		}
		return r;
	}
}

export default new LostarkAPI();
