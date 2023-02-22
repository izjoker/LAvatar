import _ from 'lodash';
import fs from 'fs';
import LostarkAPI from './lostarkAPI.model';
import CacheLocal from './../../cache/cache';
import config from './../../utils/config';


export class PackageDict {
    lostarkAPI: LostarkAPI;
    constItems: object;
    pricedItems: object;

    constructor() {
        this.lostarkAPI = new LostarkAPI();

        this.constItems = require('./../../../assets/packageDict/packageItems_const.json');
        // await this.debug()
        this.pricedItems = CacheLocal.get('pricedItems') || {};
    }

    async debug() {
        // 획득한 가격정보, 입력 안된 아이템들, string id - number id 맵 파일출력
        // 입력 안된 아이템, id맵은 누적, 가격정보는 갱신
        //
        function writeNotPricedItems(rests) {
            console.log('length of not priced items:', Object.keys(rests).length);
            fs.writeFileSync(__dirname+'/../../../assets/debug/notPricedItems.json', JSON.stringify(rests, null, 4));
        }
        function writeIdMap(prices) {
            const idMap = {};
            for (const id in prices) {
                if ({}.hasOwnProperty.call(prices, id)) {
                    idMap[id] = prices[id]['id_num'];
                }
            }
            fs.writeFileSync(__dirname+'/../../../assets/debug/idMap.json', JSON.stringify(idMap, null, 4));
        }
        function writeMergedItems(mergedItems) {
            fs.writeFileSync(__dirname+'/../../../assets/debug/merged.json', JSON.stringify(mergedItems, null, 4));
        }
        const prices = JSON.parse(fs.readFileSync('assets/debug/prices_dummy.json', 'utf-8'));
        const {mergedItems, rests} = await this.assignmentItems_debug(this.constItems, prices);
        writeNotPricedItems(rests);
        writeIdMap(prices);
        writeMergedItems(mergedItems);
        this.pricedItems = mergedItems;
    }
    async getItems() {
        if (_.isEmpty(this.pricedItems)) {
            console.log('returning constItems');
            return this.constItems;
        } else {
            console.log('returning pricedItems');
            return this.pricedItems;
        }
    }
    async mainRoutine() {
        // 60분마다 LostarkAPI에 요청하여 가격정보 획득 - 파일, 캐시로 출력
        try {
            const prices = await this.lostarkAPI.getItemPriceData();
            this.pricedItems['datas'] = await this.assignmentItems(this.constItems['datas'], prices);
            this.pricedItems['updatedAt'] = new Date().toJSON();

            // 캐시입력
            CacheLocal.set('pricedItems', this.pricedItems);
            
        } catch (e) {
            console.log(e);
            console.log(`Failed to receive Priced item datas. will retry after ${config.get('lostarkAPI.reqDelay') / 1000}s.`);
            setTimeout(()=>this.mainRoutine(), config.get('lostarkAPI.reqDelay'));
            return;
        }

        setTimeout(()=>this.mainRoutine(), config.get('packageDict.routineInterval'));
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
                id = id.normalize('NFC');
                try {
                    r1[id] = Object.assign(constItems[id], itemsWithPrice[id]);
                } catch (e) {
                    r2[id] = itemsWithPrice[id]['id_num'];
                }
            }
        }
        return {mergedItems: r1, rests: r2};
    }
}

const packageDict = new PackageDict();

export default packageDict;
