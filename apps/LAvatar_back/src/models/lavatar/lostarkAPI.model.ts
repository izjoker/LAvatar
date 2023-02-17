import fs from 'fs';
import axios from 'axios';
import config from './../../utils/config';

const classIdMap = JSON.parse(fs.readFileSync('assets/constants/classIdMap.json', 'utf-8'));
const exceptionMap = JSON.parse(fs.readFileSync('assets/constants/stringIdExceptionMap.json', 'utf-8'));
const partsMap = JSON.parse(fs.readFileSync('assets/constants/avatarPartsIdMap.json', 'utf-8'));

function sleep(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const normalizeWhitespaces = (str) => {
    return str.replace(/\xA0/g, ' ').trim();
};
const getStringId = (idNum:number, itemName:string) => {
    if (Object.keys(exceptionMap).includes(idNum.toString())) {
        return itemName + '_' + exceptionMap[idNum];
    }

    let suffix = '';
    if (300000000 <= idNum && idNum <= 399999999) {
        const classIdentifier = idNum.toString().substr(2, 2);
        const partsIdentifier = idNum.toString()[1];
        const className = classIdMap[classIdentifier];
        const partsName = partsMap[partsIdentifier];
        suffix = '_' + className;
    }
    return itemName + suffix;
};

export default class LostarkAPI {
    authToken: string;
    reqCount: number;

    constructor() {
        this.authToken = config.get('lostarkAPI.authentication.keys')[0];
        this.reqCount = 0;
    }
    async reqController() {
        this.reqCount++;
        if (this.reqCount > 95) {
            await sleep(70000);
            this.reqCount = 0;
        }
    }
    async getMarketItemList(categoryCode, pageNum) {
        let r = {};
        const url = 'https://developer-lostark.game.onstove.com/markets/items';
        const body = {
            'Sort': 'GRADE',
            'CategoryCode': categoryCode,
            'ItemGrade': null,
            'ItemName': null,
            'PageNo': pageNum,
            'SortCondition': 'ASC',
        };
        try {
            const resp = await axios.post(url, body, {
                headers: {
                    authorization: `bearer ${this.authToken}`,
                },
            });

            r = resp.data;
        } catch (e) {
            if (e.response.statusCode === 429) {
                console.log('Reached Request Limitation.');
            } else if (e.hasOwnProperty('response')) {
                console.log('error with response', e.response.status, e.response.statusCode, JSON.stringify(e.response.data, null, 4));
            } else {
                console.log('error without response', e);
            }
            r = {};
        }
        return r;
    }

    async getBulkMarketItemList(categoryCodes) {
        let data = [];
        // let count = 0
        for (const code of categoryCodes) {
            let page = 1;

            while (true) {
                await this.reqController();
                const lastResp = await this.getMarketItemList(code, page);
                data = data.concat(lastResp['Items']);
                if (lastResp['Items'].length === 0) {
                    break;
                } else {
                    page++;
                }
            }
        }

        return data;
    }

    async digestMarketItemList(marketItemListResp) {
        return marketItemListResp.reduce((acc, v) => {
            const itemName = normalizeWhitespaces(v['Name']);
            const stringId = getStringId(v['Id'], itemName);

            if (acc[stringId] === undefined) {
                acc[stringId] = {
                    'id': stringId,
                    'idNum': v['Id'],
                    'name': itemName,
                    'icon': v['Icon'],
                    'grade': v['Grade'],
                };
            }
            if (v['TradeRemainCount'] === null) {
                acc[stringId]['TradeCount'] = false;
                acc[stringId]['CurrentMinPrice'] = v['CurrentMinPrice'];
                acc[stringId]['yDayAvgPrice'] = v['YDayAvgPrice'];
            } else {
                acc[stringId]['TradeCount'] = true;
                for (let i = 0; i < 4; i++) {
                    if (i === v['TradeRemainCount']) {
                        acc[stringId][`CurrentMinPrice_${i}`] = v['CurrentMinPrice'];
                        acc[stringId][`yDayAvgPrice_${i}`] = v['YDayAvgPrice'];
                    }
                }
            }
            return acc;
        }, {});
    }

    async getItemPriceData() {
        /*
            주요 아이템 카테고리 코드
            아바타(상자포함, 무기, 악기포함): 20000
            펫(상자포함): 140000
            탈것(상자포함): 160000
        */
        console.log('Getting Price Datas.');
        const categoryCodes = [160000, 140000, 20000];
        const lists = await this.getBulkMarketItemList(categoryCodes);
        const digested = await this.digestMarketItemList(lists);
        console.log('Price Datas Received.');

        return digested;
    }
}


