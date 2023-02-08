const fs = require('fs')
const axios = require('axios')
const partsMap = require('../../../assets/constants/avatarPartsIdMap.json')
const classIdMap = require('../../../assets/constants/classIdMap.json')
const exceptionMap = require("./../../../assets/constants/stringIdExceptionMap.json") 
import config from "./../../utils/config"


function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const normalizeWhitespaces = (str) => {
    return str.replace(/\xA0/g, " ").trim()
}
const getStringId = (id_num:number, itemName:string) => {
    if(Object.keys(exceptionMap).includes(id_num.toString())){
        return itemName + "_" + exceptionMap[id_num]
    }
        
    let suffix = ''
    if (300000000 <= id_num && id_num <= 399999999) {
        
        let classIdentifier = id_num.toString().substr(2, 2)
        /* 예외처리: 우마르의역작 */
        if('00021' === id_num.toString().substr(4, 5)){
            classIdentifier = classIdentifier[0]+'0'
        }
        
        let partsIdentifier = id_num.toString()[1]
        let className = classIdMap[classIdentifier]
        let partsName = partsMap[partsIdentifier]
        suffix = '_' + className
    }
    return itemName + suffix
}

export default class LostarkAPI {
    authToken: string;
    reqCount: number;

    constructor() {
        this.authToken = config.get('lostarkAPI.authentication.keys')[0]
        this.reqCount = 0
    }
    async reqController() {
        this.reqCount++
        if (this.reqCount > 95) {
            await sleep(60000)
            this.reqCount = 0
        }
    }
    async getMarketItemList(categoryCode, pageNum) {
        let r = {}
        const url = "https://developer-lostark.game.onstove.com/markets/items"
        const body = {
            "Sort": "GRADE",
            "CategoryCode": categoryCode,
            "ItemGrade": null,
            "ItemName": null,
            "PageNo": pageNum,
            "SortCondition": "ASC"
        }
        try {
            const resp = await axios.post(url, body, {
                headers: {
                    authorization: `bearer ${this.authToken}`
                }
            })
            
            r = resp.data;
        } catch (e) {
            if (e.response.statusCode === 429){
                console.log('Reached Request Limitation.')
            }
            else if (e.hasOwnProperty('response')) {
                console.log('error with response', e.response.status, e.response.statusCode, JSON.stringify(e.response.data, null, 4))
            } else {
                console.log('error without response', e)
            }
            r = {}
        }
        return r
    }

    async getBulkMarketItemList(categoryCodes) {
        let data = []
        // let count = 0 
        for (const code of categoryCodes) {
            let page = 1
            
            while (true) {
                await this.reqController()
                const lastResp = await this.getMarketItemList(code, page)
                data = data.concat(lastResp['Items'])
                if (lastResp['Items'].length === 0) {
                    break
                } else {
                    page++
                }
            }
        }

        return data;
    }

    async digestMarketItemList(marketItemListResp) {
        return marketItemListResp.reduce((acc, v) => {
            let itemName = normalizeWhitespaces(v['Name'])
            let stringId = getStringId(v["Id"], itemName)
            
            if (acc[stringId] === undefined) {
                acc[stringId] = {
                    'id': stringId,
                    'id_num': v["Id"],
                    'name': itemName,
                    'icon': v["Icon"],
                    'grade': v['Grade']
                }
            }
            if (v['TradeRemainCount'] === null) {
                acc[stringId]['TradeCount'] = false
                acc[stringId]['CurrentMinPrice'] = v['CurrentMinPrice']
                acc[stringId]['yDayAvgPrice'] = v['YDayAvgPrice']
            } else {
                acc[stringId]['TradeCount'] = true
                for (let i = 0; i < 4; i++) {
                    if (i === v['TradeRemainCount']){
                        acc[stringId][`CurrentMinPrice_${i}`] = v['CurrentMinPrice']
                        acc[stringId][`yDayAvgPrice_${i}`] = v['YDayAvgPrice']
                    }
                }
            }
            return acc;
        }, {})
    }

    async getItemPriceData() {
        /*
            주요 아이템 카테고리 코드
            아바타(상자포함, 무기, 악기포함): 20000
            펫(상자포함): 140000
            탈것(상자포함): 160000
        */
        console.log('Getting Price Datas.')
        const categoryCodes = [160000, 140000, 20000]
        const lists = await this.getBulkMarketItemList(categoryCodes)
        const digested = await this.digestMarketItemList(lists)
        console.log('Price Datas Received.')
        
        return digested
    }
}


