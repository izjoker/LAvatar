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
    authTokens: Array<object>;
    currAuthToken: string;
    tokenIdx: number;
    reqCounts: Array<number>;

    constructor() {
        this.authTokens = []
        for(let authKey of config.get('lostarkAPI.authentication.keys')){
            this.authTokens.push({
                key: authKey,
                reqCount: 0,
            })
        }
        this.tokenIdx = 0;
    }
    async switchAuthToken(){
        this.tokenIdx++;
        if (this.tokenIdx > this.authTokens.length-1){
            this.tokenIdx = 0;
        }
    }
    async reqController() {
        let reqCount = this.authTokens[this.tokenIdx]['reqCount']++
        if (reqCount > 93) {
            this.switchAuthToken();
            if (this.tokenIdx === 0){
                await sleep(config.get('lostarkAPI.reqDelay'));
                for (let tokenObj of this.authTokens){
                    tokenObj['reqCount'] = 0;
                }
            }
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
                    authorization: `bearer ${this.authTokens[this.tokenIdx]['key']}`,
                },
            });

            r = resp.data;
        } catch (e) {
            throw(e)
        }
        return r;
    }

    async getBulkMarketItemList(categoryCodes) {
        let data = [];
        let errorCount = 0
        for (const code of categoryCodes) {
            let page = 1;

            while (true) {
                await this.reqController();
                try{
                    console.log('req for page ', page)
                    const lastResp = await this.getMarketItemList(code, page);
                    data = data.concat(lastResp['Items']);
                    if (lastResp['Items'].length === 0) {
                        break;
                    } else {
                        page++;
                    }
                }catch{
                    if (errorCount > 3){
                        throw ('Failed to get data from Lostark API')
                    }else{
                        errorCount++
                        this.switchAuthToken()
                    }
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


