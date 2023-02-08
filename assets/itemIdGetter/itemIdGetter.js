const fs = require('fs')
const axios = require('axios')

const url = "https://developer-lostark.game.onstove.com/markets/items"
const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDEzMDYifQ.o_Smu13ngkexSgncJsg6R5nI8KaQ2cNhMCopvAe5bo0EDGzEHje42hd0Ukqk4uPX0QXRe0yLed48k3SH6soSys3a_VXpXuLz0dzLtYv4FMVCnMQnOHpSImaS2Hk1hpT2sbw3LnjNFOYawfAtnYU5ZmSs-4ZjNaCWPThrltNmdgIabLfMWREWOcSsF8kZVByrbos-CXTHr5_cbzMjMLVY-QNP7mtwmGmwIvI3xJaKRg_h7_UxCgHCnxnZljMfop3wyUNNbFowk7Eb-PyyYuJtaTFVGoGTo3sek5qgNfF-L4qOuL5vHvR-cQ36Qgeb8QFOKjllOSatWYMPsu_5dfOHPw"

// module : API 조회를 하기 위한 REST(http) client
// timeout : for ratelimit
// authentication
// headers

// service : LostArk API service
const partsMap = {
    "0": "weapon",
    "1": "avatar-hat",
    "2": "avatar-top",
    "3": "avatar-pants",
    "4": "avatar-face1",
    "5": "avatar-face2",
    "6": "instrument",
}
const classIdMap = {
        "10": "전사",
        "20": "마법사",
        "30": "무도가-여",
        "35": "무도가-남",
        "40": "암살자",
        "50": "헌터-남",
        "55": "헌터-여",
        "60": "스페셜리스트",
        "11": "버서커",
        "12": "디스트로이어",
        "13": "워로드",
        "14": "홀리나이트",
        "21": "아르카나",
        "22": "서머너",
        "23": "바드",
        "24": "소서리스",
        "31": "배틀마스터",
        "32": "인파이터",
        "33": "기공사",
        "34": "창술사",
        "36": "스트라이커",
        "41": "블레이드",
        "42": "데모닉",
        "43": "리퍼",
        "51": "호크아이",
        "52": "데빌헌터",
        "53": "블래스터",
        "54": "스카우터",
        "56": "건슬링어",
        "61": "도화가",
        "62": "스페셜리스트"
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getStringId = (id_num, itemName) => {
    let itemId_num = id_num
    let suffix = ''
    if(300000000 <= itemId_num && itemId_num <= 399999999){
        let classIdentifier = itemId_num.toString().substr(2, 2)
        let partsIdentifier = itemId_num.toString()[1]
        let className = classIdMap[classIdentifier]
        let partsName = partsMap[partsIdentifier]
        suffix = '_'+className
    }
    return itemName+suffix 
}

class LostarkAPI {
    constructor(authToken) {
        this.authToken = authToken;
        this.reqCount = 0
    }
    async reqController(){
        this.reqCount++
        if (this.reqCount > 95){
            await sleep(60000)
            this.reqCount = 0
        }
    }   
    async getMarketItemList(categoryCode, pageNum) {
        let r = {}
        
        await this.reqController()
        const body = {
            "Sort": "GRADE",
            "CategoryCode": categoryCode,
            "ItemGrade": null,
            "ItemName": null,
            "PageNo": pageNum,
            "SortCondition": "ASC"
        }
        try {
            console.log(`request with code: ${categoryCode} page: ${pageNum}`);
            const resp = await axios.post(url, body, {headers:{
                authorization: `bearer ${this.authToken}`
            }})
            console.log(`got ${resp.data.Items.length} datas from API`);
            
            r = resp.data;
        } catch (e){
            if( e.hasOwnProperty('response')){
                console.log('error with response', e.response.status, e.response.statusCode, JSON.stringify(e.response.data, null, 4))
            } else {
                console.log('error without response', e)
            }
            r = {}
        }
        
        return r

    }    

    async getBulkMarketItemList (categoryCodes) {
        let data = []
        for (const code of categoryCodes) {
            let page = 1;
            
            while(true) {
                const lastResp = await this.getMarketItemList(code, page)
                data = data.concat(lastResp['Items']);
                
                if(lastResp['Items'].length === 0){
                    break;
                } else {
                    page++;
                }
                
            }
        }
        return data;
    }

    async digestMarketItemList(marketItemListResp) {
        return marketItemListResp.reduce((acc, v)=>{
            let stringId = getStringId(v["Id"], v["Name"])
            if (acc[stringId] === undefined){
                acc[stringId] = {
                    'id': stringId,
                    'id_num': v["Id"],
                    'name': v["Name"],
                    'icon': v["Icon"],
                }    
            }
            if (v['TradeRemainCount'] === null){
                acc[stringId]['TradeCount'] = false
                acc[stringId]['CurrentMinPrice'] = v['CurrentMinPrice']
            }else{
                acc[stringId]['TradeCount'] = true
                for (let i=0; i<4; i++){
                    if (i === v['TradeRemainCount'])
                    acc[stringId][`CurrentMinPrice_${i}`] = v['CurrentMinPrice']
                }
                
            }
            return acc;
        }, {})
    }
}

// service : 우리의 business logic


async function ret(apiURL, key){
    const categoryCodes = [160000, 140000, 20000]
    const lostarkApiService = new LostarkAPI(key);
    const lists = await lostarkApiService.getBulkMarketItemList(categoryCodes)
    const digested = await lostarkApiService.digestMarketItemList(lists)
    console.log(digested)
    fs.writeFileSync('itemIds.json', JSON.stringify(digested, null, 4), (err)=>{})
}
// console.log(getItemInfos(url, key))
ret(url, key)
// console.log(pageGetter(url, 20000, 1, key))
/*
    주요 아이템 카테고리 코드
    아바타(상자포함, 무기, 악기포함): 20000
    펫(상자포함): 140000
    탈것(상자포함): 160000
*/
/*
    프로세스
        1. 카테고리 선택 - 아바타, 펫, 탈것
        2. 페이지1부터 검색
        3. 검색된 아이템 건별로 이름, id, 아이콘 url 저장
        4. 검색이 안걸리게 되면 종료
    
    출력값
        {
            id: {
                id: number
                name: string
                Icon: string
            }
            ...
        }
*/

