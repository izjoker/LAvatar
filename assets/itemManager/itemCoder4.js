const _ = require('lodash')
const idRefine = require('./itemIdGetter/idRefiner')
const fs = require("fs")
class LAItem {    
    constructor(name, type, target, containedItems, tradable){
        // this.id
        this.name = name
        this.type = type // 아이템 타입
        this.target = target // 사용 가능 직업 리스트
        this.contain = containedItems // 사용시 종류를 선택하여 획득 할 수 있는 아이템 리스트
        this.tradable = tradable // 거래가능플래그
    }
}
class ContainedItem {
    constructor(className, design, category, itemIdLst){
        this.className = className // 아이템 사용시 선택할 직업명
        this.design = design // 아이템 사용시 선택할 디자인명
        this.category = category // avatar, weapon, instrument, mount, pet
        this.itemIdLst = itemIdLst // 사용시 획득하는 아이템ID 리스트
    }   
}
const getRootClass = (className) => {
    for (let rootClass in classes){
        if(classes[rootClass].includes(className)){
            return rootClass
        }
    }
}
const getChildrenId = (item) => {
    let r = []
    for (let containedItem of item['contain']){
        r = r.concat(containedItem['itemIdLst'])
    }
    return r
}
const refineIds = (obj) => {
    for (let key in obj){
        for(let containedItem of obj[key]['contain']){
            for (let itemId of containedItem['itemIdLst']){

                itemId = idRefine(itemId)
            }
        }
    }
    for (let key in obj){
        // console.log(obj[key]['contain'])
    }
    return obj

}
const renameObjKey = (obj, oldKey, newKey) => {
    delete Object.assign(obj, {[newKey]: obj[oldKey] })[oldKey];
    return obj
}


const rootClasses = ["전사", "마법사", "무도가-여", "무도가-남", "암살자", "헌터-남", "헌터-여", "스페셜리스트"]
const classes = {
    "전사":["버서커", "디스트로이어", "워로드", "홀리나이트"],
    "마법사":["아르카나", "서머너", "바드", "소서리스"],
    "무도가-여":["배틀마스터", "인파이터", "기공사", "창술사"],
    "무도가-남":["스트라이커"],
    "암살자":["블레이드", "데모닉", "리퍼"],
    "헌터-남":["호크아이", "데빌헌터", "블래스터", "스카우터"],
    "헌터-여":["건슬링어"],
    "스페셜리스트":["도화가", "기상술사"],
}
const classes_lst = [
    "버서커", "디스트로이어", "워로드", "홀리나이트",
    "아르카나", "서머너", "바드", "소서리스",
    "배틀마스터", "인파이터", "기공사", "창술사",
    "스트라이커",
    "블레이드", "데모닉", "리퍼",
    "호크아이", "데빌헌터", "블래스터", "스카우터",
    "건슬링어",
    "도화가", "기상술사"
]

const avatarPartsNameMap = {
    "머리": "avatar-hat",
    "얼굴1": "avatar-face1",
    "얼굴2": "avatar-face2",
    "상의": "avatar-top",
    "하의": "avatar-pants"
}
const genderFilter = (className) => {
    const males = ["전사", "무도가-남", "헌터-남", "버서커", "디스트로이어", "워로드", "홀리나이트", "스트라이커", "호크아이", "데빌헌터", "블래스터", "스카우터"]
    const females = ["마법사", "무도가-여", "암살자", "헌터-여", "스페셜리스트", "아르카나", "서머너", "바드", "소서리스", "배틀마스터", "인파이터", "기공사", "창술사", "블레이드", "데모닉", "리퍼", "건슬링어", "도화가", "기상술사"]
    if (males.indexOf(className) < 0){
        return "f"
    }else{
        return "m"
    }


}
const malesRoot = ["전사", "무도가-남", "헌터-남"]
const femalesRoot = ["마법사", "무도가-여", "암살자", "헌터-여", "스페셜리스트"]

const malesClass = ["디스트로이어", "워로드", "홀리나이트", "스트라이커", "호크아이", "데빌헌터", "블래스터", "스카우터"]
const femalesClass = ["스페셜리스트", "아르카나", "서머너", "바드", "소서리스", "배틀마스터", "인파이터", "기공사", "창술사", "블레이드", "데모닉", "리퍼", "건슬링어", "도화가", "기상술사"]

const weapons = {
    "버서커": "대검", 
    "디스트로이어": "전투망치", 
    "워로드": "랜스", 
    "홀리나이트": "한손검",
    "아르카나": "마법 덱", 
    "서머너": "스태프", 
    "바드": "리아네 하프",
    "소서리스": "롱 스태프",
    "배틀마스터": "건틀릿", 
    "인파이터": "헤비 건틀릿", 
    "기공사": "기공패", 
    "창술사": "창",
    "스트라이커": "건틀릿",
    "블레이드": "검", 
    "데모닉": "데모닉웨폰", 
    "리퍼": "대거",
    "호크아이": "활", 
    "데빌헌터": "총", 
    "블래스터": "런처", 
    "스카우터": "서브 머신건",
    "건슬링어": "총",
    "도화가": "붓", 
    "기상술사": "우산",
}
const weapons_id = {
    "버서커": "대검_버서커", 
    "디스트로이어": "전투망치_디스트로이어", 
    "워로드": "랜스_워로드", 
    "홀리나이트": "한손검_홀리나이트",
    "슬레이어": "대검_슬레이어",
    "아르카나": "마법 덱_아르카나", 
    "서머너": "스태프_서머너", 
    "바드": "리아네 하프_바드",
    "소서리스": "롱 스태프_소서리스",
    "배틀마스터": "건틀릿_배틀마스터", 
    "인파이터": "헤비 건틀릿_인파이터", 
    "기공사": "기공패_기공사", 
    "창술사": "창_창술사",
    "스트라이커": "건틀릿_스트라이커",
    "블레이드": "검_블레이드", 
    "데모닉": "데모닉웨폰_데모닉", 
    "리퍼": "대거_리퍼",
    "호크아이": "활_호크아이", 
    "데빌헌터": "총_데빌헌터", 
    "블래스터": "런처_블래스터", 
    "스카우터": "서브 머신건_스카우터",
    "건슬링어": "총_건슬링어",
    "도화가": "붓_도화가", 
    "기상술사": "우산_기상술사",
}
const leaf2RootMap = {
    "버서커": "전사", 
    "디스트로이어": "전사", 
    "워로드": "전사", 
    "홀리나이트": "전사",
    "아르카나": "마법사", 
    "서머너": "마법사", 
    "바드": "마법사",
    "소서리스": "마법사",
    "배틀마스터": "무도가-여", 
    "인파이터": "무도가-여", 
    "기공사": "무도가-여", 
    "창술사": "무도가-여",
    "스트라이커": "무도가-남",
    "블레이드": "암살자", 
    "데모닉": "암살자", 
    "리퍼": "암살자",
    "호크아이": "헌터-남", 
    "데빌헌터": "헌터-남", 
    "블래스터": "헌터-남", 
    "스카우터": "헌터-남",
    "건슬링어": "헌터-여",
    "도화가": "스페셜리스트", 
    "기상술사": "스페셜리스트",
}
const rootclassBracketFormatter = (rootClass) => {
    if (rootClass.split('-')[1] !== undefined){

        let head = rootClass.split('-')[0]
        
        let gender = rootClass.split('-')[1]
        rootClass = head+'('+gender+')'

    }
    return rootClass
}


const Build_romance = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_.push('전사-여')
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["새해 첫 발걸음 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["새해 토끼 선택 상자"]))
    obj["2023 설빔: 새해 첫 발걸음"] = new LAItem("2023 설빔: 새해 첫 발걸음", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '광휘의 첫 발걸음',
        '야망의 첫 발걸음',
        '낭만의 첫 발걸음',
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [
            `${design} 아바타 세트`
        ]))
    }
    obj["새해 첫 발걸음 아바타 선택 상자"] = new LAItem("새해 첫 발걸음 아바타 선택 상자", 'avatarSetPackage', [], containedItems, true)
    

    
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴_${rootClass}`
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "모자": 'avatar-hat',  
        "헤어": 'avatar-hat', 
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "얼굴": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let design of designs){
        for (let childId_ of getChildrenId(obj[`${design} 아바타 세트`])){
        
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            let type = avatarPartsNameMap_[partsName]
            if (genderFilter(className) === 'm' && design.includes("낭만")){
                type = "avatar-face1"
            }
            obj[childId_] = new LAItem(itemName, type, [className], [], true) 
        }
    }
    

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 뽀송한 호키',
        '펫 : 발랄한 포키',
        '펫 : 똘망한 베키',
        '펫 : 깜찍한 코키',
        '펫 : 한껏 들뜬 니키',
        '펫 : 차분히 설렌 라키',
        '펫 : 곱게 단장한 호키',
    
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['새해 토끼 선택 상자'] = new LAItem('새해 토끼 선택 상자', 'petPackage', [], containedItems, true)


    return obj
}
const Build_slayer = (obj) => {

    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["양립하는 분노 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["양립하는 분노 무기 선택 상자"]))
    obj["슬레이어 런칭"] = new LAItem("슬레이어 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["서늘한 분노", "타오르는 분노"]
    for (let design of designs){
        let className = '슬레이어'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["양립하는 분노 아바타 선택 상자"] = new LAItem("양립하는 분노 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '슬레이어'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`양립하는 분노 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    

    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    let weapons_ = weapons
    
    let className = '슬레이어'
    for (design of designs){
        containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
    }

    obj["양립하는 분노 무기 선택 상자"] = new LAItem("양립하는 분노 무기 선택 상자", "weaponPackage", [className], containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['양립하는 분노 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }
    return obj
}
const Build_kinder = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_.push('전사-여')
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["모코코 유치원 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["모코코 유치원 강아지 선택 상자"]))
    obj["아크 패스: 모코코 유치원"] = new LAItem("아크 패스: 모코코 유치원", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "모코코 햇살반",
        "모코코 새싹반"
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [
            `${design} 아바타 세트`
        ]))
    }
    obj["모코코 유치원 아바타 선택 상자"] = new LAItem("모코코 유치원 아바타 선택 상자", 'avatarSetPackage', rootClasses_, containedItems, true)
    

    
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 모자_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "모자": 'avatar-hat',  
        "헤어": 'avatar-hat', 
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let design of designs){
        for (let childId_ of getChildrenId(obj[`${design} 아바타 세트`])){
        
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        
        }
    
    }
    

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 햇살반 보들이',
        '펫 : 새싹반 구름이'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['모코코 유치원 강아지 선택 상자'] = new LAItem('모코코 유치원 강아지 선택 상자', 'petPackage', [], containedItems, true)


    return obj
}


const Build_2023neria3rd = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    let partsMap = {
        "햇": "avatar-hat",
        "헬멧": "avatar-hat",
        "캡": "avatar-hat",
        "상의": "avatar-top",
        "하의": "avatar-pants",
        "상하의": "avatar-onepiece",
    }
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "크리스마스 무드", "avatar", ["파티 상하의 선택 상자"]))


    for (let rootClass of rootClasses){
        containedItems.push(new ContainedItem(rootClass, "크리스마스 무드", "avatar", [
            `윈터 퍼 햇_${rootClass}`,
            `윈터 내추럴 상의_${rootClass}`,
            `윈터 어반 상의_${rootClass}`,
            `윈터 스포티 상의_${rootClass}`,
            `윈터 팬시 하의_${rootClass}`,
            `윈터 부츠 하의_${rootClass}`,
            `글리터 파티 상하의_${rootClass}`,
            `락시크 파티 상하의_${rootClass}`,
            `윈터 니트 상하의_${rootClass}`,
        ]))
    }
    
    
    obj["2022 3rd 네리아의 드레스룸"] = new LAItem("2022 3rd 네리아의 드레스룸", "package_type3", [], containedItems , false)

    //아바타선택 - 전직업
    let designs = [
        "글리터 파티",
        "락시크 파티"
    ]
    
    
    containedItems = []    
    for (let design of designs){
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, "크리스마스 무드", 'avatar', [
                `${design} 상하의_${rootClass}`
            ]))
        }
    }
    obj[`파티 상하의 선택 상자`] = new LAItem(`파티 상하의 선택 상자`, 'avatarPackage', rootClasses_, containedItems, true)
    
    for (let containedItem of obj["2022 3rd 네리아의 드레스룸"]['contain']){
        for (let itemId of containedItem['itemIdLst']){
            for (let key of Object.keys(partsMap)){
                if (itemId.includes(key) && !itemId.includes('상자')){
                    obj[itemId] = new LAItem(itemId.split("_")[0], partsMap[key], [itemId.split("_")[1]], [], true)
                    continue
                }
            }            
        }
    }
    return obj
}

const Build_witcher = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["더 위쳐 아바타 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["더 위쳐 무기 상자"]))
    obj["더 위쳐 아바타"] = new LAItem("더 위쳐 아바타", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "위쳐"
    ]
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design}의 헤어_${rootClass}`,
                `${design}의 상의_${rootClass}`,
                `${design}의 하의_${rootClass}`
            ]))
        }
        obj[`더 위쳐 아바타 상자`] = new LAItem(`더 위쳐 아바타 상자`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "헤어": 'avatar-hat', 
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`더 위쳐 아바타 상자`])){
        
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    
    }


    // 무기 선택 상자
    designs = ['위쳐']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 ${weapons_id[className]}`]))
        }
    }
    obj["더 위쳐 무기 상자"] = new LAItem("더 위쳐 무기 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['더 위쳐 무기 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}

const Build_anniv4thData = (obj) => {
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["모험의 노래 아바타 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["모험의 노래 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", [`모험의 노래 아바타 선택 상자 [전사-여]`]))
    containedItems.push(new ContainedItem("", "", "weapon", [`모험의 노래 무기 선택 상자 [슬레이어]`]))
    
    containedItems.push(new ContainedItem("", "", "mount", ["봉인된 화신 탈 것 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["키스 펫 선택 상자"]))
    obj["위대한 모험의 노래"] = new LAItem("위대한 모험의 노래", "package_type1", "all", containedItems , false)
    //아바타선택 - 전직업
    containedItems = []
    for (let rootClass of rootClasses){
        containedItems.push(new ContainedItem(rootClass, "", "avatar", [`모험의 노래 아바타 상자 [${rootClass}]`]))
    }
    obj["모험의 노래 아바타 상자"] = new LAItem("모험의 노래 아바타 상자", "avatarSetPackage", [], containedItems , true) 
    // 아바타선택 - 직업별
    for (let rootClass of rootClasses){
           
        containedItems = []
        designs = ["용기", "마음"]
        for (let design of designs){
            containedItems.push(new ContainedItem(`${rootClass}`, `4주년 ${design} 아바타`, "avatar", [`4주년 ${design} 아바타 세트 [${rootClass}]`])) 
        }
        obj[`모험의 노래 아바타 상자 [${rootClass}]`] = new LAItem(`모험의 노래 아바타 상자 [${rootClass}]`, "avatarSetPackage", [], containedItems, true)
    }
    // 아바타상자
    designs = ["용기", "마음"]
    for (let rootClass of rootClasses){
        for(let design of designs){
            let faceNum = 0
            if (genderFilter(rootClass) === "m"){
                faceNum = 1
            }else{
                faceNum = 2
            }
            containedItems = []
            containedItems.push(new ContainedItem(rootClass, `4주년 ${design} 아바타`, "avatar", [
                `4주년 ${design} 머리_${rootClass}`,
                `4주년 ${design} 얼굴${faceNum}_${rootClass}`,
                `4주년 ${design} 상의_${rootClass}`,
                `4주년 ${design} 하의_${rootClass}`,
            ]))
            obj[`4주년 ${design} 아바타 세트 [${rootClass}]`] = new LAItem(`4주년 ${design} 아바타 세트 [${rootClass}]`, "avatarPackage", [rootClass], containedItems, true)
        }
    }
    // 아바타
    designs = ["용기", "마음"]
    let setName = ["4주년 용기 아바타", "4주년 마음 아바타"]
    for (let key in avatarPartsNameMap){
        for (let design of designs){
            for (let rootClass of rootClasses){
                if (key === "얼굴1"){
                    if (genderFilter(rootClass) === 'm'){
                        obj[`4주년 ${design} ${key}_${rootClass}`] = new LAItem(`4주년 ${design} ${key}`, `${avatarPartsNameMap[key]}`, [rootClass], [], true)
                    }
                    
                }else if (key === "얼굴2"){
                    if (genderFilter(rootClass) === 'f'){
                        
                        obj[`4주년 ${design} ${key}_${rootClass}`] = new LAItem(`4주년 ${design} ${key}`, `${avatarPartsNameMap[key]}`, [rootClass], [], true)
                    }
                    
                }else{
                    obj[`4주년 ${design} ${key}_${rootClass}`] = new LAItem(`4주년 ${design} ${key}`, `${avatarPartsNameMap[key]}`, [rootClass], [], true)
                }
            }
            
        
        }
        
    }
    // "모험의 노래 무기 선택 상자",
    designs = ["용기", "마음"]
    containedItems = []
    for (let key in weapons){
        for (design of designs){
            containedItems.push(new ContainedItem(key, `4주년 ${design} 아바타`, 'weapon', [`4주년 ${design} ${weapons_id[key]}`]))
        }
    }
    obj["모험의 노래 무기 선택 상자"] = new LAItem("모험의 노래 무기 선택 상자", "weaponPackage", classes_lst, containedItems, true)
    // 무기
    for (let key in weapons) {
        for (design of designs)
            obj[`4주년 ${design} ${weapons_id[key]}`] = new LAItem(`4주년 ${design} ${weapons[key]}`, "weapon", [key], [], true)
    }
    // "봉인된 화신 탈 것 선택 상자",
    containedItems = []
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 질서의 화신"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 업화의 화신"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 멸화의 화신"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 뇌전의 화신"]))
    obj["봉인된 화신 탈 것 선택 상자"] = new LAItem("봉인된 화신 탈 것 선택 상자", "mountPackage", [], containedItems, true)
    // 화신 탈것
    for (let containedItem of obj["봉인된 화신 탈 것 선택 상자"]["contain"]){
        for (let itemId of containedItem['itemIdLst']){
            obj[itemId] = new LAItem(itemId, "mount", [], [], true)
        }
        
    }

    // "키스 펫 선택 상자"
    containedItems = []
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 눈부신 키스"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 달콤한 키스"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 아련한 키스"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 차가운 키스"]))
    obj["키스 펫 선택 상자"] = new LAItem("키스 펫 선택 상자", "petPackage", [],containedItems, true)
    for (let containedItems_ of obj["키스 펫 선택 상자"]["contain"]){
        for (let itemId of containedItems_[`itemIdLst`]){
            obj[itemId] = new LAItem(itemId, "pet", [], [], true)
        }
    }


    // 슬레이어 추가
    let rootClass = '전사-여'
    
    /////
    containedItems = []
    designs = ["용기", "마음"]
    for (let design of designs){
        containedItems.push(new ContainedItem(`${rootClass}`, `4주년 ${design} 아바타`, "avatar", [`4주년 ${design} 아바타 세트 [${rootClass}]`])) 
    }
    obj[`모험의 노래 아바타 선택 상자 [${rootClass}]`] = new LAItem(`모험의 노래 아바타 상자 [${rootClass}]`, "avatarSetPackage", [], containedItems, true)
    
    // 아바타상자
    designs = ["용기", "마음"]
    for(let design of designs){
        faceNum = 1
        containedItems = []
        containedItems.push(new ContainedItem(rootClass, `4주년 ${design} 아바타`, "avatar", [
            `4주년 ${design} 머리_${rootClass}`,
            `4주년 ${design} 얼굴${faceNum}_${rootClass}`,
            `4주년 ${design} 상의_${rootClass}`,
            `4주년 ${design} 하의_${rootClass}`,
        ]))
        obj[`4주년 ${design} 아바타 세트 [${rootClass}]`] = new LAItem(`4주년 ${design} 아바타 세트 [${rootClass}]`, "avatarPackage", [rootClass], containedItems, true)
    }

    // 아바타
    designs = ["용기", "마음"]
    for (let key in avatarPartsNameMap){
        for (let design of designs){
            if (key==='얼굴2'){
                continue
            }

            obj[`4주년 ${design} ${key}_${rootClass}`] = new LAItem(`4주년 ${design} ${key}`, `${avatarPartsNameMap[key]}`, [rootClass], [], true)
        }
        
    }
    // "모험의 노래 무기 선택 상자",
    designs = ["용기", "마음"]
    containedItems = []
    let key = '슬레이어'
    for (design of designs){
        containedItems.push(new ContainedItem(key, `4주년 ${design} 아바타`, 'weapon', [`4주년 ${design} ${weapons_id[key]}`]))
    }

    obj["모험의 노래 무기 선택 상자 [슬레이어]"] = new LAItem("모험의 노래 무기 선택 상자", "weaponPackage", ['슬레이어'], containedItems, true)
    // 무기
    for (design of designs){
        obj[`4주년 ${design} ${weapons_id[key]}`] = new LAItem(`4주년 ${design} ${weapons[key]}`, "weapon", [key], [], true)
    }
    return obj
}
const Build_gothicData = (obj) => {
    // 패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ['고딕 아바타 선택 상자']))
    containedItems.push(new ContainedItem("", "", "mount", ['장미의 왕좌 선택 상자']))
    containedItems.push(new ContainedItem("", "", "pet", ['밤 고양이 선택 상자']))
    obj["고딕 아바타"] = new LAItem("고딕 아바타", "package_type1", [], containedItems, false)
    // 아바타상자 선택 상자 - 디자인 선택
    const designs = ["고혹적인", "신비로운", "기묘한"]
    containedItems = []
    for (let design of designs){
        
        containedItems.push(new ContainedItem("", "", 'avatar', [`${design} 고딕 아바타 세트`]))
    }
    obj["고딕 아바타 선택 상자"] = new LAItem("고딕 아바타 선택 상자", "avatarSetPackage", [], containedItems, true)
    
    // 아바타상자
    for (let design of designs){
        // 고혹적인 고딕 귀고리
        // 고혹적인 고딕 모자
        // 고혹적인 고딕 메이크업
        // 고혹적인 고딕 상의
        // 고혹적인 고딕 하의
        containedItems = []
            
        for (let rootClass of rootClasses){
            containedItems.push(new ContainedItem(rootClass, `${design} 고딕 아바타`, 'avatar', [
                `${design} 고딕 모자_${rootClass}`,
                `${design} 고딕 메이크업_${rootClass}`,
                `${design} 고딕 귀고리_${rootClass}`,
                `${design} 고딕 상의_${rootClass}`,
                `${design} 고딕 하의_${rootClass}`
            ]))
        
        }
        obj[`${design} 고딕 아바타 세트`] = new LAItem(`${design} 고딕 아바타 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    // 아바타
    const partsMap = {"모자":"avatar-hat", "메이크업":"avatar-face1", "귀고리":"avatar-face2", "상의":"avatar-top", "하의":"avatar-pants"}
    for (let design of designs){
        for(let key in partsMap){
            for (let rootClass of rootClasses){
                obj[`${design} 고딕 ${key}_${rootClass}`] = new LAItem(`${design} 고딕 ${key}`, partsMap[key], [rootClass], [], true)    
            }
        }
    }
    // "pets": ["밤 고양이 선택 상자"],
    containedItems = []
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 오후의 신사 먀옹이"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 유자 망토 애옹이"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 새벽을 여는 냐옹이"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 밤의 무법자 아옹이"]))
    obj["밤 고양이 선택 상자"] = new LAItem("밤 고양이 선택 상자", "petPackage", [], containedItems, true)
    // 고양이 펫
    for (let containedItem of obj["밤 고양이 선택 상자"]['contain']){
        obj[containedItem['itemIdLst'][0]] = new LAItem(containedItem['itemIdLst'][0], "pet", [], [], true)
    }
    // "rides": ["장미의 왕좌 선택 상자"]
    containedItems = []
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 우아한 장미의 왕좌"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 분노한 장미의 왕좌"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 고귀한 장미의 왕좌"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 고요한 장미의 왕좌"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 순수한 장미의 왕좌"]))
    obj["장미의 왕좌 선택 상자"] = new LAItem("장미의 왕좌 선택 상자", "mountPackage", [], containedItems, true)

    // 왕좌
    for (let containedItem of obj["장미의 왕좌 선택 상자"]["contain"]){
        let name = containedItem['itemIdLst'][0]
        obj[name] = new LAItem(name, "mount", [], [], true)
    }

    return obj
}
const Build_2ndNeriaData = (obj) => {
    let containedItems = []
    let partsMap = {
        "헬멧": "avatar-hat",
        "캡": "avatar-hat",
        "상의": "avatar-top",
        "하의": "avatar-pants",
    }
    for (let rootClass of rootClasses){
        containedItems.push(new ContainedItem(rootClass, "야구 유니폼", "avatar", [`야구 유니폼 헬멧_${rootClass}`, `야구 유니폼 상의_${rootClass}`, `야구 유니폼 하의_${rootClass}`]))
        containedItems.push(new ContainedItem(rootClass, "야구 점퍼", "avatar", [`야구 점퍼 캡_${rootClass}`, `야구 점퍼 상의_${rootClass}`, `야구 점퍼 하의_${rootClass}`]))
    }
    obj["2022 2nd 네리아의 드레스룸"] = new LAItem("2022 2nd 네리아의 드레스룸", "package_type2", rootClasses, containedItems, false)
    
    for (let containedItem of obj["2022 2nd 네리아의 드레스룸"]['contain']){
        for (let itemId of containedItem['itemIdLst']){
            for (let key of Object.keys(partsMap)){
                if (itemId.includes(key)){
                    obj[itemId] = new LAItem(itemId.split("_")[0], partsMap[key], [itemId.split("_")[1]], [], true)
                    continue
                }
                
            }            
        }
    }
    return obj
}
const Build_2022beachData = (obj) => {
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["비치웨어 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["비치웨어 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["윈드서핑 세트 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["개구리 펫 선택 상자"]))
    obj["축제의 섬 비치웨어"] = new LAItem("축제의 섬 비치웨어", "package_type1", "all", containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["라일라이 비치웨어", "티카티카 비치웨어", "테돈바드 비치웨어", "아이라 비치웨어", "오레하 비치웨어", "나스카 버블배스"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`${design} 세트`]))
    }
    obj["비치웨어 아바타 선택 상자"] = new LAItem("비치웨어 아바타 선택 상자", "avatarSetPackage", [], containedItems , true) 
    
    // 아바타상자
    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let partsName in avatarPartsNameMap_){
        for (design of designs){
            for (let rootClass of rootClasses){
                obj[`${design} ${partsName}_${rootClass}`] = new LAItem(`${design} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
            
            }
        }
    }

    // 무기 선택 상자
    designs = ["라일라이 비치웨어", "티카티카 비치웨어", "테돈바드 비치웨어"]
    containedItems = []
    for (let className in weapons){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["비치웨어 무기 선택 상자"] = new LAItem("비치웨어 무기 선택 상자", "weaponPackage", classes_lst, containedItems, true)
    // 무기
    for (let className in weapons) {
        for (design of designs)
            obj[`${design} ${weapons_id[className]}`] = new LAItem(`${design} ${weapons[className]}`, "weapon", [className], [], true)
    }

    // "윈드서핑 세트 선택 상자",
    containedItems = []
    
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 윈드서핑 세트 P"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 윈드서핑 세트 Y"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 윈드서핑 세트 S"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 윈드서핑 세트 B"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 윈드서핑 세트 W"]))
    
    obj["윈드서핑 세트 선택 상자"] = new LAItem("윈드서핑 세트 선택 상자", "mountPackage", [], containedItems, true)
    // 화신 탈것
    for (let containedItem of obj["윈드서핑 세트 선택 상자"]["contain"]){
        for (let itemId of containedItem['itemIdLst']){
            obj[itemId] = new LAItem(itemId, "mount", [], [], true)
        }
        
    }

    // "펫 선택 상자"
    containedItems = []
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 즐거운 뽀롱"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 개구진 뽀이"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 으쓱한 뽀글"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 귀여운 뽀미"]))
    containedItems.push(new ContainedItem("", "", "pet", ["펫 : 시크한 뽀작"]))
    obj["개구리 펫 선택 상자"] = new LAItem("개구리 펫 선택 상자", "petPackage", [],containedItems, true)
    for (let containedItems_ of obj["개구리 펫 선택 상자"]["contain"]){
        for (let itemId of containedItems_[`itemIdLst`]){
            obj[itemId] = new LAItem(itemId, "pet", [], [], true)
        }
    }
    return obj
}

const Build_DarkPriestData = (obj) => {
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["다크 프리스트 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["다크 프리스트 무기 선택 상자"]))
    obj["아크 패스: 다크 프리스트"] = new LAItem("아크 패스: 다크 프리스트", "package_type1", [], containedItems , false)


    //아바타선택 - 전직업
    containedItems = []
    let designs = ["단죄의 프리스트", "심판의 프리스트"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`${design} 아바타 세트`]))
    }
    obj["다크 프리스트 아바타 선택 상자"] = new LAItem("다크 프리스트 아바타 선택 상자", "avatarSetPackage", [], containedItems , true) 
    
    // 아바타상자
    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let partsName in avatarPartsNameMap_){
        for (design of designs){
            for (let rootClass of rootClasses){
                obj[`${design} ${partsName}_${rootClass}`] = new LAItem(`${design} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
            
            }
        }
    }

    // 무기 선택 상자
    containedItems = []
    for (let className in weapons){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["다크 프리스트 무기 선택 상자"] = new LAItem("다크 프리스트 무기 선택 상자", "weaponPackage", classes_lst, containedItems, true)
    // 무기
    for (let className in weapons) {
        for (design of designs)
            obj[`${design} ${weapons_id[className]}`] = new LAItem(`${design} ${weapons[className]}`, "weapon", [className], [], true)
    }
    return obj
}


const Build_weatherMancerData = (obj) => {
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["기상 이변 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["기상 이변 무기 선택 상자"]))
    obj["기상술사 런칭"] = new LAItem("기상술사 런칭", "package_type1", [], containedItems , false)


    //아바타선택 - 전직업
    containedItems = []
    let designs = ["구름의 이변", "안개의 이변"]
    for (let design of designs){
        let className = '기상술사'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["기상 이변 아바타 선택 상자"] = new LAItem("기상 이변 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '기상술사'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`기상 이변 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    // 무기 선택 상자
    containedItems = []
    for (let className in weapons){
        for (design of designs){
            if (className === '기상술사'){
                containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
            }
        }
    }
    obj["기상 이변 무기 선택 상자"] = new LAItem("기상 이변 무기 선택 상자", "weaponPackage", ['기상술사'], containedItems, true)
    // 무기
    for (let className in weapons) {
        for (design of designs)
            if (className === "기상술사"){
                obj[`${design} ${weapons_id[className]}`] = new LAItem(`${design} ${weapons[className]}`, "weapon", [className], [], true)
            }
    }
    return obj
}

const Build_BAMData = (obj) => {
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["버틀러 앤 메이드 아바타 선택 상자"]))
    obj["버틀러 앤 메이드"] = new LAItem("버틀러 앤 메이드", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["포쉬", "심플"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`${design} 버틀러 앤 메이드 세트`]))
    }
    obj["버틀러 앤 메이드 아바타 선택 상자"] = new LAItem("버틀러 앤 메이드 아바타 선택 상자", "avatarSetPackage", [], containedItems , true) 

    // 아바타상자

    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            if (genderFilter(rootClass) === 'm'){
                design_ = design.concat(' 버틀러')
            }else{
                design_ = design.concat(' 메이드')
            }
            
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design_} 머리_${rootClass}`,
                `${design_} 상의_${rootClass}`,
                `${design_} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 버틀러 앤 메이드 세트`] = new LAItem(`${design} 버틀러 앤 메이드 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let partsName in avatarPartsNameMap_){
        for (design of designs){
            for (let rootClass of rootClasses){
                if (genderFilter(rootClass) === 'm'){
                    design_ = design.concat(' 버틀러')
                }else{
                    design_ = design.concat(' 메이드')
                }
                obj[`${design_} ${partsName}_${rootClass}`] = new LAItem(`${design_} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
                
                
            
            }
        }
    }

    return obj
}
const Build_1stNeriaData = (obj) => {
    //패키지
    let containedItems = []
    let designs = ['비트박스', '스트릿']
    for (let design of designs){
        for (let rootClass of rootClasses){
            if (design === "비트박스"){
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `비트박스 햇_${rootClass}`,
                    `비트박스 귀고리_${rootClass}`,
                    `비트박스 하이햇 상의_${rootClass}`,
                    `비트박스 스네어 상의_${rootClass}`,
                    `비트박스 하의_${rootClass}`
                ]))
            
            } else {
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `스트릿 심플 상의_${rootClass}`,
                    `스트릿 데님 후드_${rootClass}`,
                    `스트릿 데님 자켓_${rootClass}`,
                    `스트릿 심플 하의_${rootClass}`,
                    `스트릿 스웻 하의_${rootClass}`
                ]))
            }

        }
    }

    obj["2022 1st 네리아의 드레스룸"] = new LAItem("2022 1st 네리아의 드레스룸", "package_type2", [], containedItems , false)
    
    // 아바타
    
    
        for (let design of designs){
            let avatarPartsNameMap_ = {}
            if (design === "비트박스"){
                avatarPartsNameMap_ = {
                    '햇': 'avatar-hat',
                    '귀고리': 'avatar-face2',
                    '하이햇 상의': 'avatar-top#1',
                    '스네어 상의': 'avatar-top#2',
                    '하의': 'avatar-pants'
                }
            } else {
                avatarPartsNameMap_ = {
                    '심플 상의': 'avatar-top#1',
                    '데님 후드': 'avatar-top#2',
                    '데님 자켓': 'avatar-top#3',
                    '심플 하의': 'avatar-pants#1',
                    '스웻 하의': 'avatar-pants#2'
                }
            }
            for (let partsName in avatarPartsNameMap_){
                for (let rootClass of rootClasses){
                    obj[`${design} ${partsName}_${rootClass}`] = new LAItem(`${design} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
                
            }
                
        }    
            
            
    }

    return obj
}

const Build_heavenData = (obj) => {
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["천공의 권능 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["천공의 권능 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["기상술사 천공의 권능 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["기상술사 천공의 권능 무기 선택 상자"]))
    obj["천공의 권능"] = new LAItem("천공의 권능", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["천공의 권세", "천공의 능력"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`${design} 아바타 세트`]))
    }
    obj["천공의 권능 아바타 선택 상자"] = new LAItem("천공의 권능 아바타 선택 상자", "avatarSetPackage", [], containedItems , true) 
    
    // 아바타상자

    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let partsName in avatarPartsNameMap_){
        for (design of designs){
            for (let rootClass of rootClasses){
                obj[`${design} ${partsName}_${rootClass}`] = new LAItem(`${design} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
            
            }
        }
    }

    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["천공의 권능 무기 선택 상자"] = new LAItem("천공의 권능 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기
    for (let containedItem of obj["천공의 권능 무기 선택 상자"]['contain']){
        let itemId = containedItem['itemIdLst'][0]
        obj[itemId] = new LAItem(itemId.split('_')[0], 'weapon', [itemId.split('_')[1]], [], true)
    }

    // 기상술사

    //아바타선택 - 전직업
    containedItems = []
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`기상술사 ${design} 세트`]))
    }
    obj["기상술사 천공의 권능 아바타 선택 상자"] = new LAItem("기상술사 천공의 권능 아바타 선택 상자", "avatarSetPackage", [], containedItems , true) 
    
    // 아바타상자
    
    for(let design of designs){
        containedItems = []
        containedItems.push(new ContainedItem('기상술사', design, "avatar", [
            `${design} 머리_스페셜리스트`,
            `${design} 상의_스페셜리스트`,
            `${design} 하의_스페셜리스트`,
        ]))
        obj[`기상술사 ${design} 세트`] = new LAItem(`기상술사 ${design} 세트`, "avatarPackage", rootClasses, containedItems, true)
    }

    // 무기 선택 상자
    containedItems = []
    for (design of designs){
        let className = '기상술사' 
        containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
    }
    
    obj["기상술사 천공의 권능 무기 선택 상자"] = new LAItem("기상술사 천공의 권능 무기 선택 상자", "weaponPackage", ['기상술사'], containedItems, true)
    // 무기
    for (let containedItem of obj["기상술사 천공의 권능 무기 선택 상자"]['contain']){
        let itemId = containedItem['itemIdLst'][0]
        obj[itemId] = new LAItem(itemId.split('_')[0], 'weapon', [itemId.split('_')[1]], [], true)
    }


    return obj
}
const Build_preppyData = (obj) => {
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["프레피 룩 선택 상자"]))
    obj["프레피 룩"] = new LAItem("프레피 룩", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["산뜻한 프레피", "편안한 프레피"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, "avatar", [`${design} 룩 세트`]))
    }
    obj["프레피 룩 선택 상자"] = new LAItem("프레피 룩 선택 상자", "avatarSetPackage", [], containedItems , true) 
    
    // 아바타상자

    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리띠_${rootClass}`,
                `${design} 안경_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 룩 세트`] = new LAItem(`${design} 세트`, "avatarPackage", rootClasses, containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리띠": 'avatar-hat',
        "안경": 'avatar-face1',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let partsName in avatarPartsNameMap_){
        for (design of designs){
            for (let rootClass of rootClasses){
                obj[`${design} ${partsName}_${rootClass}`] = new LAItem(`${design} ${partsName}`, `${avatarPartsNameMap_[partsName]}`, [rootClass], [], true)
            
            }
        }
    }
    return obj
}

const Build_2022newyearData = (obj) => {
    
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["새해의 기원 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["새해의 기원 무기 선택 상자"]))
    obj["2022년 설빔: 새해의 기원"] = new LAItem("2022년 설빔: 새해의 기원", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["새해의 행복", "새해의 애정", "새해의 용기", "새해의 보람"]
    for (let design of designs){
        containedItems.push(new ContainedItem('', design, 'avatar', [`${design} 세트`]))
    }
    obj["새해의 기원 아바타 선택 상자"] = new LAItem("새해의 기원 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    
    // 머리, [복면, 귀고리], 상의, 하의
    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses){
            let faceItemName = ""
            if (genderFilter(rootClass) === "m"){
                faceItemName = '복면'
            }else{
                faceItemName = '귀고리'
            }
            
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리_${rootClass}`,
                `${design} ${faceItemName}_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }

        obj[`${design} 세트`] = new LAItem(`${design} 세트`, "avatarPackage", rootClasses, containedItems, true)
    
    }

    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "복면": 'avatar-face2', 
        "귀고리": 'avatar-face2',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let design of designs){
        for (let childId of getChildrenId(obj[`${design} 세트`])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    

    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["새해의 기원 무기 선택 상자"] = new LAItem("새해의 기원 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['새해의 기원 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_painterData = (obj) => {
    
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["차원과 환영 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["차원과 환영 무기 선택 상자"]))
    obj["도화가 런칭"] = new LAItem("도화가 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["차원의 정수", "환영의 정수"]
    for (let design of designs){
        let className = '도화가'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["차원과 환영 아바타 선택 상자"] = new LAItem("차원과 환영 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '도화가'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`차원과 환영 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    

    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    let weapons_ = weapons
    
    for (let className in weapons_){
        if (className !== '도화가'){
            continue
        }
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["차원과 환영 무기 선택 상자"] = new LAItem("차원과 환영 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['차원과 환영 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_winterBless = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
        
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "mount", ["마법 침대 탈 것 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["호두까기 인형 선택 상자"]))
    obj["겨울 맞이 스페셜 패키지"] = new LAItem("겨울 맞이 스페셜 패키지", "package_type1", [], containedItems , false)

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 알렉세이',
        '펫 : 예브게니',
        '펫 : 미하일',
        '펫 : 루슬란',
    
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['호두까기 인형 선택 상자'] = new LAItem('호두까기 인형 선택 상자', 'petPackage', [], containedItems, true)



    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 푸르른 꿈결 침대',
        '탈 것 : 동심의 꿈결 침대',
        '탈 것 : 새하얀 꿈결 침대',
        '탈 것 : 몽환의 꿈결 침대',
        '탈 것 : 기억의 꿈결 침대',
    
    ]
    for (let name of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [name]))
        obj[name] = new LAItem(name, 'mount', [], [], true)
    }
    obj['마법 침대 탈 것 선택 상자'] = new LAItem('마법 침대 탈 것 선택 상자', 'petPackage', [], containedItems, true)


    return obj
}
const Build_2021_2ndNeriaData = (obj) => {
    //패키지
    let containedItems = []
    let designs = ['파자마 파티', '겨울 코트 룩']
    
    let rootClasses_ = rootClasses
    
    
    for (let design of designs){
        for (let rootClass of rootClasses_){
            if (genderFilter(rootClass) === "m" && design === '파자마 파티'){
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `포근한 파자마 머리 A_${rootClass}`,
                    `포근한 파자마 머리 B_${rootClass}`,
                    `포근한 파자마 얼굴1 A_${rootClass}`,
                    `포근한 파자마 얼굴1 B_${rootClass}`,
                    `포근한 파자마 얼굴2 A_${rootClass}`,
                    `포근한 파자마 얼굴2 B_${rootClass}`,
                    `포근한 칼라 파자마 상의_${rootClass}`,
                    `포근한 후드 파자마 상의_${rootClass}`,
                    `포근한 칼라 파자마 하의_${rootClass}`,
                    `포근한 후드 파자마 하의_${rootClass}`,
                ]))
            
            } else if (genderFilter(rootClass) === "m" && design === '겨울 코트 룩') {
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `포근한 코트 머리 A_${rootClass}`,
                    `포근한 코트 머리 B_${rootClass}`,
                    `포근한 코트 얼굴1 A_${rootClass}`,
                    `포근한 코트 얼굴1 B_${rootClass}`,
                    `포근한 캐주얼 코트 상의_${rootClass}`,
                    `포근한 클래식 코트 상의_${rootClass}`,
                    `포근한 노르딕 스웨터 상의_${rootClass}`,
                    `포근한 목도리 스웨터 상의_${rootClass}`,
                    `포근한 블랙 진_${rootClass}`,
                    `포근한 블루 진_${rootClass}`,
                ]))
            } else if (genderFilter(rootClass) === "f" && design === '파자마 파티'){
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `포근한 파자마 머리 A_${rootClass}`,
                    `포근한 파자마 머리 B_${rootClass}`,
                    `포근한 파자마 얼굴1 A_${rootClass}`,
                    `포근한 파자마 얼굴1 B_${rootClass}`,
                    `포근한 파자마 얼굴2 A_${rootClass}`,
                    `포근한 파자마 얼굴2 B_${rootClass}`,
                    `포근한 가디건 파자마 상의_${rootClass}`,
                    `포근한 리본 파자마 상의_${rootClass}`,
                    `포근한 가디건 파자마 하의_${rootClass}`,
                    `포근한 리본 파자마 하의_${rootClass}`,
                ]))
            } else {
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `포근한 코트 머리 A_${rootClass}`,
                    `포근한 코트 머리 B_${rootClass}`,
                    `포근한 코트 얼굴1 A_${rootClass}`,
                    `포근한 코트 얼굴1 B_${rootClass}`,
                    `포근한 캐주얼 코트 상의_${rootClass}`,
                    `포근한 클래식 코트 상의_${rootClass}`,
                    `포근한 노르딕 스웨터 상의_${rootClass}`,
                    `포근한 목도리 스웨터 상의_${rootClass}`,
                    `포근한 코트 하의_${rootClass}`,
                    `포근한 스웨터 하의_${rootClass}`,
                ]))
            }

        }
    }

    obj["2021 2nd 네리아의 드레스룸"] = new LAItem("2021 2nd 네리아의 드레스룸", "package_type2", [], containedItems , false)
    
    // 아바타
    let avatarPartsNameMap_ = {
        '머리': 'avatar-hat',
        '얼굴1 A': 'avatar-face1',
        '얼굴1 B': 'avatar-face1',
        '얼굴2 A': 'avatar-face2',
        '얼굴2 B': 'avatar-face2',
        '상의': 'avatar-top',
        '하의': 'avatar-pants',
        ' 진': 'avatar-pants'
    }
    for(let childId of getChildrenId(obj['2021 2nd 네리아의 드레스룸'])){
        let className = childId.split('_')[1]
        let itemName = childId.split('_')[0]
        let type_ = ""
        for (let partsName in avatarPartsNameMap_){
            if (itemName.includes(partsName)){
                type_ = avatarPartsNameMap_[partsName]
                
                break
            }
        }
        // console.log('type', type)
        obj[childId] = new LAItem(itemName, type_, [className], [], true)
    }
     

    return obj
}
const Build_3rdAnnivData = (obj) => {
    let rootClasses_ = rootClasses
    rootClasses_ = rootClasses_.filter((e) => e !== '스페셜리스트')
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']

    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["함께한 시간 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["함께한 시간 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["함께한 시간 아바타 상자 [스페셜리스트]"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["함께한 시간 무기 상자 [도화가]"]))
    containedItems.push(new ContainedItem("", "", "mount", ["가이츠 로더 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["쁘띠세이튼 선택 상자"]))
    obj["3주년 함께한 시간"] = new LAItem("3주년 함께한 시간", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    for (let rootClass of rootClasses_){
        containedItems.push(new ContainedItem('', '', 'avatar', [`함께한 시간 아바타 상자 [${rootClass}]`]))
    }
    
    obj["함께한 시간 아바타 선택 상자"] = new LAItem("함께한 시간 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    //아바타선택 - 직업별
    
    let designs = ["3주년 추억", "3주년 미래"]
    for (let rootClass of rootClasses_){
        containedItems = []
        for (let design of designs){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [`${design} 아바타 세트 [${rootClass}]`]))
        }
        obj[`함께한 시간 아바타 상자 [${rootClass}]`] = new LAItem(`함께한 시간 아바타 상자 [${rootClass}]`, "avatarSetPackage", [rootClass], containedItems , true)    
    }

    //아바타실물팩
    
    let partsMap = {
        '전사': '얼굴2',
        '마법사': '얼굴2',
        '무도가-여': '얼굴2',
        '무도가-남': '얼굴1',
        '암살자': '얼굴2',
        '헌터-남': '얼굴2',
        '헌터-여': '얼굴2',
        '스페셜리스트': '얼굴2',
    }
    for (let rootClass of rootClasses){
        let facetype = partsMap[rootClass]
        for (let design of designs){
            containedItems = []
            containedItems.push(new ContainedItem('', design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} ${facetype}_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
            obj[`${design} 아바타 세트 [${rootClass}]`] = new LAItem(`${design} 아바타 세트 [${rootClass}]`, "avatarPackage", [rootClass], containedItems , true)    
        }
        
    }
    

    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let rootClass of rootClasses){
        for (let design of designs){
            for (let childId of getChildrenId(obj[`${design} 아바타 세트 [${rootClass}]`])){
                let itemName = childId.split('_')[0]
                let className = childId.split('_')[1]
                let partsName = itemName.split(' ')[itemName.split(' ').length - 1]    
                obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true)
            }
        }
        
    }

    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    for (let className in weapons_){        
        for (let design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["함께한 시간 무기 선택 상자"] = new LAItem("함께한 시간 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['함께한 시간 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    // containedItems.push(new ContainedItem("", "", "mount", ["가이츠 로더 선택 상자"]))
    containedItems = []
    let mountNameLst = [
        '탈 것 : 가이츠 로더 - B',
        '탈 것 : 가이츠 로더 - D',
        '탈 것 : 가이츠 로더 - R',
        '탈 것 : 가이츠 로더 - L',
        '탈 것 : 가이츠 로더 - W',
        '탈 것 : 가이츠 로더 - P',
        '탈 것 : 가이츠 로더 - M',
        '탈 것 : 가이츠 로더 - G']
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['가이츠 로더 선택 상자'] = new LAItem('가이츠 로더 선택 상자', 'mountPackage', [], containedItems, true)


    //pet
    // containedItems.push(new ContainedItem("", "", "pet", ["쁘띠세이튼 선택 상자"]))
    containedItems = []
    let petNameLst = [
        '펫 : 음흉한 쿠캬',
        '펫 : 흑화한 쿠큐',
        '펫 : 재가된 쿠옹',
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem(petName, '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['쁘띠세이튼 선택 상자'] = new LAItem('쁘띠세이튼 선택 상자', 'petPackage', [], containedItems, true)
    //specialist
    containedItems = []
    
    let rootClass = '스페셜리스트'
    let className = '도화가'

    for (let design of designs){
        containedItems.push(new ContainedItem(className, design, 'avatar', [
            `${design} 아바타 세트 [${rootClass}]`,
        ]))
    }
    
    obj[`함께한 시간 아바타 상자 [${rootClass}]`] = new LAItem(`함께한 시간 아바타 상자 [${rootClass}]`, 'avatarSetPackage', [rootClass], containedItems, true)

    for (let design of designs){
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [
            `${design} 머리_${rootClass}`,
            `${design} 얼굴2_${rootClass}`,
            `${design} 상의_${rootClass}`,
            `${design} 하의_${rootClass}`,
        ]))
        obj[`${design} 아바타 세트 [${rootClass}]`] = new LAItem(`${design} 아바타 세트 [${rootClass}]`, 'avatarPackage', [rootClass], containedItems, true)

    }
    
    for (let childId_ of getChildrenId(obj[`함께한 시간 아바타 상자 [${rootClass}]`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]    
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true)
        }
    
    }

    rootclass = '스페셜리스트'
    className = '도화가'
    weapons_ = {'도화가': '붓'}
    containedItems = []
    for (let className in weapons_){        
        for (let design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj[`함께한 시간 무기 상자 [${className}]`] = new LAItem(`함께한 시간 무기 선택 상자 [${className}]`, "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj[`함께한 시간 무기 상자 [${className}]`])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }


    return obj
}

const Build_2021_1stNeriaData = (obj) => {
    //패키지
    let containedItems = []
    let designs = ['캐주얼 룩', '할로윈 파티 룩']
    
    let rootClasses_ = rootClasses
    rootClasses_ = rootClasses_.filter((e) => e !== '스페셜리스트')
    
    
    for (let [i, design] of designs.entries()){
        for (let rootClass of rootClasses_){
            if (genderFilter(rootClass) === "m" && i === 0){
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `베이직 스냅백_${rootClass}`,
                    `베이직 뿔테 안경_${rootClass}`,
                    `베이직 래글런 티셔츠_${rootClass}`,
                    `베이직 가디건_${rootClass}`,
                    `베이직 쇼츠_${rootClass}`,
                    `베이직 진_${rootClass}`,
                ]))
            
            } else if (genderFilter(rootClass) === "f" && i === 0) {
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `베이직 스냅백_${rootClass}`,
                    `베이직 뿔테 안경_${rootClass}`,
                    `베이직 래글런 티셔츠_${rootClass}`,
                    `베이직 플레어 원피스_${rootClass}`,
                    `베이직 돌핀 쇼츠_${rootClass}`,
                    `베이직 진_${rootClass}`,
                ]))
            } else {
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `악몽의 장난 머리_${rootClass}`,
                    `동화의 장난 머리_${rootClass}`,
                    `환상의 장난 머리_${rootClass}`,
                    `악몽의 장난 상의_${rootClass}`,
                    `동화의 장난 상의_${rootClass}`,
                    `환상의 장난 상의_${rootClass}`,
                    `악몽의 장난 하의_${rootClass}`,
                    `동화의 장난 하의_${rootClass}`,
                    `환상의 장난 하의_${rootClass}`,
                ]))
            }

        }
    }

    obj["2021 1st 네리아의 드레스룸"] = new LAItem("2021 1st 네리아의 드레스룸", "package_type2", [], containedItems , false)
    
    // 아바타
    let avatarPartsNameMap_ = {
        '머리': 'avatar-hat',
        '스냅백': 'avatar-hat',
        '안경': 'avatar-face1',
        '얼굴1 B': 'avatar-face1',
        '얼굴2 A': 'avatar-face2',
        '얼굴2 B': 'avatar-face2',
        '상의': 'avatar-top',
        '티셔츠': 'avatar-top',
        '원피스': 'avatar-top',
        '가디건': 'avatar-top',
        '하의': 'avatar-pants',
        '쇼츠': 'avatar-pants',
        ' 진': 'avatar-pants'
    }
    for(let childId of getChildrenId(obj['2021 1st 네리아의 드레스룸'])){
        let className = childId.split('_')[1]
        let itemName = childId.split('_')[0]
        let type_ = ""
        for (let partsName in avatarPartsNameMap_){
            if (itemName.includes(partsName)){
                type_ = avatarPartsNameMap_[partsName]
                
                break
            }
        }
        // console.log('type', type)
        obj[childId] = new LAItem(itemName, type_, [className], [], true)
    }
     

    return obj
}
const Build_glideData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["글라이드 슈트 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["네온 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["바이크 탈 것 선택 상자"]))
    obj["글라이드 앤 네온"] = new LAItem("글라이드 앤 네온", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["글라이드 G 슈트", "글라이드 R 슈트", "글라이드 W 슈트"]
    for (let design of designs){
        containedItems.push(new ContainedItem('', design, 'avatar', [`${design} 세트`]))
    }
    obj["글라이드 슈트 아바타 선택 상자"] = new LAItem("글라이드 슈트 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    
    for(let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            
            
            containedItems.push(new ContainedItem(rootClass, design, "avatar", [
                `${design} 머리_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }

        obj[`${design} 세트`] = new LAItem(`${design} 세트`, "avatarPackage", rootClasses_, containedItems, true)
    
    }

    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let design of designs){
        for (let childId of getChildrenId(obj[`${design} 세트`])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    

    // 무기 선택 상자
    designs = ['네온 G', '네온 R', '네온 W']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["네온 무기 선택 상자"] = new LAItem("네온 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['네온 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 글라이드 G 바이크',
        '탈 것 : 글라이드 W 바이크',
        '탈 것 : 글라이드 R 바이크',
        '탈 것 : 글라이드 O 바이크',
        '탈 것 : 글라이드 B 바이크',
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['바이크 탈 것 선택 상자'] = new LAItem('바이크 탈 것 선택 상자', 'mountPackage', [], containedItems, true)

    return obj
}

const Build_sorceressData = (obj) => {
    
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["원소의 축복 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["원소의 축복 무기 선택 상자"]))
    obj["소서리스 런칭"] = new LAItem("소서리스 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["파괴의 원소", "창조의 원소"]
    for (let design of designs){
        let className = '소서리스'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["원소의 축복 아바타 선택 상자"] = new LAItem("원소의 축복 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '소서리스'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`원소의 축복 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    
    // 무기 선택 상자
    designs = designs.slice(0,2)
    containedItems = []
    let weapons_ = {'소서리스': '롱 스태프'}
    
    for (let className in weapons_){
        
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["원소의 축복 무기 선택 상자"] = new LAItem("원소의 축복 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['원소의 축복 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_2021summerData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["한여름밤의 꿈 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["한여름밤의 꿈 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["소서리스 한여름밤의 꿈 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "instrument", ["한여름밤의 꿈 악기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["갑주 마차 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["불가사리 펫 선택 상자"]))
    obj["한 여름 밤의 꿈"] = new LAItem("한 여름 밤의 꿈", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["태양의 꿈", "모래의 꿈", "파도의 꿈", "바람의 꿈", "구름의 꿈"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["한여름밤의 꿈 아바타 선택 상자"] = new LAItem("한여름밤의 꿈 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    

    

    

    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`한여름밤의 꿈 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
        
    }
    

    // 무기 선택 상자
    designs = ['태양', '모래', '파도']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    for (let className in weapons_){
        for (design of designs){
            if (genderFilter(className) === 'm'){
                containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 소년 ${weapons_id[className]}`]))
            }else{
                containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 소녀 ${weapons_id[className]}`]))
            }
        }
    }
    obj["한여름밤의 꿈 무기 선택 상자"] = new LAItem("한여름밤의 꿈 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['한여름밤의 꿈 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    containedItems = []
    className = '소서리스'
    for (let design of designs){
        containedItems.push(new ContainedItem('소서리스', design, 'weapon', [`${design}의 소녀 ${weapons_id[className]}`]))
    }
    obj["소서리스 한여름밤의 꿈 무기 선택 상자"] = new LAItem("소서리스 한여름밤의 꿈 무기 선택 상자", 'weaponPackage', ['소서리스'], containedItems, true)
    for (let childId of getChildrenId(obj["소서리스 한여름밤의 꿈 무기 선택 상자"])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }
    // 악기 선택 상자
    designs = ['태양의 꿈', '모래의 꿈', '파도의 꿈']
    containedItems = []
    for (let rootClass of rootClasses_){
        for (design of designs){
            containedItems.push(new ContainedItem(rootClass, `${design}`, 'weapon', [`${design} 악기_${rootClass}`]))
        }
    }
    obj["한여름밤의 꿈 악기 선택 상자"] = new LAItem("한여름밤의 꿈 악기 선택 상자", "instrumentPackage", rootClasses_, containedItems, true)
    // 악기

    for (let childId of getChildrenId(obj['한여름밤의 꿈 악기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'instrument', [className], [], true)
    }

    

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 산호 갑주 마차',
        '탈 것 : 오팔 갑주 마차',
        '탈 것 : 오닉스 갑주 마차',
        '탈 것 : 루비 갑주 마차',
        '탈 것 : 진주 갑주 마차',
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['갑주 마차 선택 상자'] = new LAItem('갑주 마차 선택 상자', 'mountPackage', [], containedItems, true)


    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 바다별 핑키',
        '펫 : 바다별 동구',
        '펫 : 바다별 아치',
        '펫 : 바다별 할라',
        '펫 : 바다별 후크',
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['불가사리 펫 선택 상자'] = new LAItem('불가사리 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}

const Build_petraniaData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["페트라니아의 기사 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["페트라니아의 기사 무기 선택 상자"]))
    
    obj["페트라니아의 기사"] = new LAItem("페트라니아의 기사", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["홍염의 기사", "혼돈의 기사", "잿빛의 기사"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["페트라니아의 기사 아바타 선택 상자"] = new LAItem("페트라니아의 기사 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }


    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`페트라니아의 기사 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
        
    }
    

    // 무기 선택 상자
    designs = [
        '홍염의 명성',
        '혼돈의 명성',
        '잿빛의 명성',
    ]
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    for (let className in weapons_){
        for (design of designs){
            
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        
        }
    }
    obj["페트라니아의 기사 무기 선택 상자"] = new LAItem("페트라니아의 기사 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['페트라니아의 기사 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_sosData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["슈테른의 그림자 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["슈테른의 그림자 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["표범 펫 선택 상자"]))
    obj["슈테른의 그림자"] = new LAItem("슈테른의 그림자", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["대도시의 심연", "대도시의 광휘"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트`
        ]))        
    }
    obj["슈테른의 그림자 아바타 선택 상자"] = new LAItem("슈테른의 그림자 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }


    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`슈테른의 그림자 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    

    // 무기 선택 상자
    designs = ['심연의 통치자', '광휘의 통치자']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["슈테른의 그림자 무기 선택 상자"] = new LAItem("슈테른의 그림자 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['슈테른의 그림자 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }


    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 빌브린 흑표',
        '펫 : 볼다이크 레오파드',
        '펫 : 슈샤이어 설표'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['표범 펫 선택 상자'] = new LAItem('표범 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}
const Build_strikerData = (obj) => {
    
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["무도의 길 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["무도의 길 무기 선택 상자"]))
    obj["스트라이커 런칭"] = new LAItem("스트라이커 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["통찰하는 철의 무인", "깨어나는 은둔의 무인"]
    
    for (let design of designs){
        let className = '스트라이커'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["무도의 길 아바타 선택 상자"] = new LAItem("무도의 길 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    
    
    for (let design of designs){
        let className = '스트라이커'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', ["스트라이커"], containedItems, true)
    }
    
    
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`무도의 길 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    
    // 무기 선택 상자
    designs = ['운명의 오라', '영겁의 오라']
    containedItems = []
    let weapons_ = {'스트라이커': '건틀릿'}
    
    for (let className in weapons_){
        
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["무도의 길 무기 선택 상자"] = new LAItem("무도의 길 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['무도의 길 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_springDreamData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "weapon", ["봄날의 꿈 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["스트라이커 봄날 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["시바견 펫 선택 상자"]))
    obj["봄날의 꿈"] = new LAItem("봄날의 꿈", "package_type1", [], containedItems , false)

    // 무기 선택 상자
    designs = ['찬란한', '맹목적인', '침묵하는']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    let weaponNameMap = {
        '전사': '요괴',
        '무도가-여': '계시',
        '무도가-남': '야수',
        '헌터-남': '찰나',
        '헌터-여': '꽃비',
        '마법사': '지혜',
        '암살자': '승천',
    }
    for (let className in weapons_){
        let rootClass = getRootClass(className)
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weaponNameMap[rootClass]} ${weapons_id[className]}`]))
        }
    }
    obj["봄날의 꿈 무기 선택 상자"] = new LAItem("봄날의 꿈 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['봄날의 꿈 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    containedItems = []
    className = '스트라이커'
    for (design of designs){
        containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weaponNameMap['무도가-남']} ${weapons_id[className]}`]))
    }
    obj["스트라이커 봄날 무기 선택 상자"] = new LAItem("스트라이커 봄날 무기 선택 상자", "weaponPackage", ['스트라이커'], containedItems, true)
    for (let childId of getChildrenId(obj['스트라이커 봄날 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 보리',
        '펫 : 먼지',
        '펫 : 두부',
        '펫 : 절미',
        '펫 : 양갱',
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['시바견 펫 선택 상자'] = new LAItem('시바견 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}
const Build_gunslingerData = (obj) => {
    
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["의뢰의 시작 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["의뢰의 시작 무기 선택 상자"]))
    obj["건슬링어 런칭"] = new LAItem("건슬링어 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["신비로운 마탄의 사수", "신비로운 심판의 탄환", "신비로운 불멸의 단죄자"]
    for (let design of designs){
        let className = '건슬링어'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["의뢰의 시작 아바타 선택 상자"] = new LAItem("의뢰의 시작 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        containedItems = []
        let className = '건슬링어'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`의뢰의 시작 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    // 무기 선택 상자
    designs = ['마탄의 사수', '심판의 탄환', '불멸의 단죄자']
    containedItems = []
    let weapons_ = {'건슬링어': '총'}
    
    for (let className in weapons_){
        
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["의뢰의 시작 무기 선택 상자"] = new LAItem("의뢰의 시작 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['의뢰의 시작 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}
const Build_2021newyearData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트' && e !== '무도가-남' )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["도령과 낭자 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["스트라이커 설빔 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["호랑이 탈 것 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["아기소 펫 선택 상자"]))
    obj["설맞이 도령과 낭자"] = new LAItem("설맞이 도령과 낭자", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = ["청아한 가람", "우아한 노을", "눈부신 나래", "고고한 달무리", "화려한 꽃보라"]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트_남`
        ]))        
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트_여`
        ]))        
    }
    obj["도령과 낭자 아바타 선택 상자"] = new LAItem("도령과 낭자 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    let rootClasses_m = []
    let rootClasses_f = []
    for (let rootClass of rootClasses_){
        if(genderFilter(rootClass) ==='m'){
            rootClasses_m.push(rootClass)
        }else{
            rootClasses_f.push(rootClass)
        }
    }

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_m){
            
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 도령 머리_${rootClass}`,
                `${design} 도령 상의_${rootClass}`,
                `${design} 도령 하의_${rootClass}`,
                `${design} 도령 얼굴1_${rootClass}`,
            ]))
        }    
        obj[`${design} 세트_남`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_m, containedItems, true)
    }
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_f){
            
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 낭자 머리_${rootClass}`,
                `${design} 낭자 상의_${rootClass}`,
                `${design} 낭자 하의_${rootClass}`,
                `${design} 낭자 얼굴1_${rootClass}`,
            ]))
        }    
        obj[`${design} 세트_여`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_f, containedItems, true)
    }

    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`도령과 낭자 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
        
    }

    containedItems = []
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트_무도가-남`
        ]))        
    }
    obj["스트라이커 설빔 선택 상자"] = new LAItem("스트라이커 설빔 선택 상자", "avatarSetPackage", [], containedItems , true)

    
    for (let design of designs){
        containedItems = []
        let rootClass = '무도가-남'    
        if (genderFilter(rootClass) === 'm'){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 도령 머리_${rootClass}`,
                `${design} 도령 상의_${rootClass}`,
                `${design} 도령 하의_${rootClass}`,
                `${design} 도령 얼굴1_${rootClass}`,
            ]))
        }else{
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 낭자 머리_${rootClass}`,
                `${design} 낭자 상의_${rootClass}`,
                `${design} 낭자 하의_${rootClass}`,
                `${design} 낭자 얼굴1_${rootClass}`,
            ]))
        }
        obj[`${design} 세트_${rootClass}`] = new LAItem(`${design} 세트`, 'avatarPackage', [rootClass], containedItems, true)
    }

    // 아바타
    for (let childId of getChildrenId(obj[`스트라이커 설빔 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
        
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 날렵한 주홍 산군',
        '탈 것 : 날렵한 설백 산군',
        '탈 것 : 고상한 주홍 산군',
        '탈 것 : 고상한 칠흑 산군',
        '탈 것 : 신묘한 설백 산군',
        '탈 것 : 신묘한 황금 산군',
        '탈 것 : 용맹한 설백 산군',
        '탈 것 : 용맹한 담묵 산군',
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['호랑이 탈 것 선택 상자'] = new LAItem('호랑이 탈 것 선택 상자', 'mountPackage', [], containedItems, true)


    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 밀키',
        '펫 : 쿠키',
        '펫 : 몰키',
        '펫 : 쵸키',
        '펫 : 뭉키',
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['아기소 펫 선택 상자'] = new LAItem('아기소 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}

const Build_festivalData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트' && e !== '무도가-남' )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["축제와 무도회 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["축제와 무도회 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["눈덩이 탈 것 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["망토 여우 펫 선택 상자"]))
    obj["축제와 무도회"] = new LAItem("축제와 무도회", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "눈꽃의 겨울 축제", 
        "황혼의 겨울 축제", 
        "밤의 겨울 축제", 
        "눈꽃의 겨울 무도회", 
        "황혼의 겨울 무도회", 
        "밤의 겨울 무도회", 
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트`
        ]))        
    }
    obj["축제와 무도회 선택 상자"] = new LAItem("축제와 무도회 선택 상자", "avatarSetPackage", [], containedItems , true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`축제와 무도회 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // 무기 선택 상자
    designs = ['눈꽃의 심장', '오로라의 눈', '트리의 영혼', '한밤의 별']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["축제와 무도회 무기 선택 상자"] = new LAItem("축제와 무도회 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['축제와 무도회 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 눈꽃의 데구르눈',
        '탈 것 : 겨울의 데구르눈',
        '탈 것 : 축제의 데구르눈',
        '탈 것 : 달콤한 데구르눈',
        '탈 것 : 차가운 데구르눈',
        '탈 것 : 빛나는 데구르눈'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['눈덩이 탈 것 선택 상자'] = new LAItem('눈덩이 탈 것 선택 상자', 'mountPackage', [], containedItems, true)


    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 고드름 망토 슈슈',
        '펫 : 앵두 망토 슈키',
        '펫 : 당근 망토 슈리',
        '펫 : 포도 망토 슈나',
        '펫 : 도토리 망토 슈피',
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['망토 여우 펫 선택 상자'] = new LAItem('망토 여우 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}
const Build_anniv2ndData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>e !== '스페셜리스트')
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["모험가의 아바타 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["모험가의 무기 상자"]))
    obj["2주년 모험가의 선택"] = new LAItem("2주년 모험가의 선택", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    for (let rootClass of rootClasses_){
        
        rootClass = rootclassBracketFormatter(rootClass)
        containedItems.push(new ContainedItem("", "", 'avatar', [
            `모험가의 아바타 상자 [${rootClass}]`
        ]))        
    }
    obj["모험가의 아바타 상자"] = new LAItem("모험가의 아바타 상자", "avatarSetPackage", [], containedItems , true)

    let designMap = {
        '전사': ['암흑 지배자의 축복', '균열 지배자의 축복', '혹한 지배자의 축복', '창공 지배자의 축복'],
        '마법사': [
            '초록 나비의 여신', 
            '분홍 나비의 여신', 
            '붉은 나비의 여신', 
            '푸른 나비의 여신'
        ],
        '무도가-여': [
            '창천의 라이더', 
            '호천의 라이더', 
            '상천의 라이더', 
            '민천의 라이더'
        ],
        '무도가-남': [
            '창천의 바이커', 
            '호천의 바이커', 
            '상천의 바이커', 
            '민천의 바이커'
        ],
        '헌터-남': [
            '밤의 특수요원', 
            '사막의 특수요원', 
            '정글의 특수요원', 
            '설원의 특수요원'
        ],
        '헌터-여': [
            '다크 에이전트', 
            '터프 에이전트', 
            '와일드 에이전트', 
            '시크 에이전트'
        ],
        '암살자': [
            '데런의 푸른빛 영혼', 
            '데런의 보라빛 영혼', 
            '데런의 붉은빛 영혼', 
            '데런의 새하얀 영혼'
        ]
    }
    for (let rootClass of rootClasses_){
        containedItems = []
        let rootClass_bracket = rootclassBracketFormatter(rootClass)
            
        for (let design of designMap[rootClass]){
            
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
        }
        obj[`모험가의 아바타 상자 [${rootClass_bracket}]`] = new LAItem(`모험가의 아바타 상자 [${rootClass_bracket}]`, 'avatarPackage', [rootClass], containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`모험가의 아바타 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // // 무기 선택 상자
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    
    for(let rootClass of rootClasses_){
        containedItems.push(new ContainedItem(rootClass, "", 'weapon', [`모험가의 무기 상자 [${rootclassBracketFormatter(rootClass)}]`] ))
        
    }   
    obj["모험가의 무기 상자"] = new LAItem("모험가의 무기 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
         
    let wDesignMap_root = {
        '전사': [
            '푸른', 
            '붉은', 
            '차가운', 
            '빛나는'],
        '마법사': [
            '따스한', 
            '유혹하는', 
            '처벌하는', 
            '차가운'
        ],
        '무도가-여': [
            '어둠의', 
            '하늘의', 
            '백설의', 
            '불꽃의'
        ],
        '무도가-남': [
            '흑철의', 
            '창공의', 
            '화염의', 
            '칠흑의'
        ],
        '헌터-남': [
            '어둠의', 
            '사막의', 
            '밀림의', 
            '설원의'
        ],
        '헌터-여': [
            '다크', 
            '터프', 
            '와일드', 
            '시크'
        ],
        '암살자': [
            '푸른', 
            '자주빛', 
            '붉은', 
            '하얀'
        ]
    }
    let wDesignMap_leafClass = {
        "버서커": "암흑의", 
        "디스트로이어": "혹한의", 
        "워로드": "균열의 열기", 
        "홀리나이트": "눈의",
        "아르카나": "꽃잎의", 
        "서머너": "꽃잎의", 
        "바드": "꽃잎의",
        "배틀마스터": "발톱", 
        "인파이터": "질주", 
        "기공사": "심장", 
        "창술사": "일격",
        "스트라이커": "발톱",
        "블레이드": "피의", 
        "데모닉": "피의", 
        "리퍼": "피의",
        "호크아이": "컴파운드", 
        "데빌헌터": "컴파운드", 
        "블래스터": "컴파운드", 
        "스카우터": "컴파운드",
        "건슬링어": "컴파운드"
    }

    for (let rootClass of rootClasses_){
        containedItems = []
        for (let leafClass in wDesignMap_leafClass){
            for (let design of wDesignMap_root[getRootClass(leafClass)]){
                containedItems.push(new ContainedItem(leafClass, design, 'weapon', [`${design} ${wDesignMap_leafClass[leafClass]} ${weapons_id[leafClass]}`]))
            }
        }
        obj[`모험가의 무기 상자 [${rootclassBracketFormatter(rootClass)}]`] = new LAItem(`모험가의 무기 상자 [${rootclassBracketFormatter(rootClass)}]`, "weaponPackage", [rootClass], containedItems, true)       
    }
    // // 무기

    for (let childId_ of getChildrenId(obj['모험가의 무기 상자'])){
        for(let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
        }
    }


    return obj
}
const Build_2021halloweenData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["할로윈 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["할로윈 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["꼬마 유령 선택 상자"]))
    obj["할로윈 마왕과 마녀의 축제"] = new LAItem("할로윈 마왕과 마녀의 축제", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '고귀한 마왕의 축제',
        '차가운 마왕의 축제',
        '핏빛 마왕의 축제',
        '고귀한 마녀의 축제',
        '빛나는 마녀의 축제',
        '발랄한 마녀의 축제'
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트`
        ]))        
    }
    obj["할로윈 아바타 선택 상자"] = new LAItem("할로윈 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
                    
            if (genderFilter(rootClass)==='m' && design.includes('마왕') ||
                genderFilter(rootClass)==='f' && design.includes('마녀')){
                    containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                        `${design} 머리_${rootClass}`,
                        `${design} 상의_${rootClass}`,
                        `${design} 하의_${rootClass}`,
                        `${design} 얼굴1_${rootClass}`,
                        `${design} 얼굴2_${rootClass}`,
                    ]))
                }
            
        }
        if (design.includes('마왕')){
            obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', ['전사', '헌터-남'], containedItems, true)
        }else{
            obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', ['마법사', '무도가-여', '암살자'], containedItems, true)
        }
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`할로윈 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // 무기 선택 상자
    
    let wDesignMap_leafClass = {
        "버서커": ['검붉은 화염의', '차가운 화염의', '진홍빛 화염의'], 
        "디스트로이어": ['검붉은 열화의', '차가운 열화의', '진홍빛 열화의'], 
        "워로드": ['검붉은 저주의', '차가운 저주의', '진홍빛 저주의'], 
        "홀리나이트": ['검붉은 축복의', '차가운 축복의', '진홍빛 축복의'],
        "아르카나": [
            '밤의 가시넝쿨',
            '백야의 가시넝쿨',
            '축제의 가시넝쿨',
        ], 
        "서머너": [
            '밤의 심장',
            '백야의 심장',
            '축제의 심장',
        ], 
        "바드": [
            '밤의 날개',
            '백야의 날개',
            '축제의 날개',
        ],
        "배틀마스터": [
            '끝없는 악몽의',
            '끝없는 파멸의',
            '끝없는 재앙의',
        ], 
        "인파이터": [
            '빛나는 악몽의',
            '빛나는 파멸의',
            '빛나는 재앙의',
        ], 
        "기공사": [
            '스산한 악몽의',
            '스산한 파멸의',
            '스산한 재앙의',
        ], 
        "창술사": [
            '마녀의 악몽의',
            '마녀의 파멸의',
            '마녀의 재앙의',
        ],
        "블레이드": [
            '푸른 저주의 니들',
            '빛나는 저주의 니들',
            '핏빛 저주의 니들',
        ], 
        "데모닉": [
            '푸른 스켈레톤의',
            '빛나는 스켈레톤의',
            '핏빛 스켈레톤의',
        ], 
        "리퍼": [
            '푸른 영혼의 사슬낫',
            '빛나는 영혼의 사슬낫',
            '핏빛 영혼의 사슬낫',
        ],
        "호크아이": [
            '주시하는 어둠의 날개',
            '주시하는 새벽의 날개',
            '주시하는 노을의 날개',
        ], 
        "데빌헌터": [
            '심판하는 어둠의',
            '심판하는 새벽의',
            '심판하는 노을의',
        ], 
        "블래스터": [
            '단죄하는 어둠의',
            '단죄하는 새벽의',
            '단죄하는 노을의',
        ], 
        "스카우터": [
            '처벌하는 어둠의',
            '처벌하는 새벽의',
            '처벌하는 노을의',
        ],
        
    }
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    let weapons_id_ = _.cloneDeep(weapons_id)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    weapons_id_['블레이드'] = '블레이드_블레이드'
    for (let className in weapons_){
        for (design of wDesignMap_leafClass[className]){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id_[className]}`]))
        }
    }
    obj["할로윈 무기 선택 상자"] = new LAItem("할로윈 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['할로윈 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let petNameLst = [
        '펫 : 포이포이',
        '펫 : 포이호이',
        '펫 : 포이라이',
        '펫 : 포이뮤이',
        '펫 : 포이아이',
        '펫 : 포이코이'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['꼬마 유령 선택 상자'] = new LAItem('꼬마 유령 선택 상자', 'petPackage', [], containedItems, true)



    return obj
}
const Build_reaperData = (obj) => {
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["에이전트 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["에이전트 무기 선택 상자"]))
    obj["리퍼 런칭"] = new LAItem("리퍼 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "새벽의 에이전트",
        "어둠의 에이전트", 
        "황혼의 에이전트"
    ]
    for (let design of designs){
        let className = '리퍼'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["에이전트 아바타 선택 상자"] = new LAItem("에이전트 아바타 선택 상자", "avatarPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '리퍼'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`에이전트 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    // 무기 선택 상자
    designs = [
        '새벽의 에이전트',
        '어둠의 에이전트',
        '황혼의 에이전트'
    ]
    containedItems = []
    let weapons_ = {'리퍼': '대거'}
    
    for (let className in weapons_){
        
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["에이전트 무기 선택 상자"] = new LAItem("에이전트 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['에이전트 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}

const Build_piratesData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["해적왕 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["해적 앵무새 펫 선택 상자"]))
    obj["해적왕"] = new LAItem("해적왕", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '검은 너울',
        '하얀 파도',
        '푸른 바다',
        
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["해적왕 아바타 선택 상자"] = new LAItem("해적왕 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `해적왕의 ${design} 머리_${rootClass}`,
                `해적왕의 ${design} 상의_${rootClass}`,
                `해적왕의 ${design} 하의_${rootClass}`,
                `해적왕의 ${design} 얼굴1_${rootClass}`,
                `해적왕의 ${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`해적왕 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }



    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 앵드레이크',
        '펫 : 앵킨스',
        '펫 : 앵스패로우',
        '펫 : 앵보니',
        '펫 : 앵르바로스'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['해적 앵무새 펫 선택 상자'] = new LAItem('해적 앵무새 펫 선택 상자', 'petPackage', [], containedItems, true)



    return obj
}

const Build_scouterData = (obj) => {
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["로보틱스 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["홍염과 청염의 무기 선택 상자"]))
    obj["스카우터 런칭"] = new LAItem("스카우터 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "홍염의 로보틱스",
        "청염의 로보틱스"
    ]
    for (let design of designs){
        let className = '스카우터'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 세트`]))
    }
    obj["로보틱스 아바타 선택 상자"] = new LAItem("로보틱스 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        let className = '스카우터'
        containedItems = []
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상의_${className}`, `${design} 하의_${className}`]))
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', [className], containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId_ of getChildrenId(obj[`로보틱스 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    // 무기 선택 상자
    designs = [
        '홍염의',
        '청염의'
    ]
    containedItems = []
    let weapons_ = {'스카우터': '서브 머신건'}
    
    for (let className in weapons_){

        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["홍염과 청염의 무기 선택 상자"] = new LAItem("홍염과 청염의 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['홍염과 청염의 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}

const Build_swimsuitsData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["파도 수영복 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["해변 수영복 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["바람 수영복 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["모래 수영복 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["수영복 무기 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "instrument", ["수영복 악기 아바타 선택 상자"]))
    obj["2020 수영복"] = new LAItem("2020 수영복", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs1 = [
        '파도',
        '해변',
        '바람',
        '모래'    
    ]
    
    let designs2 = [
        '여름빛',
        '노을빛',
        '새벽빛',
        
    ]
    for (let design1 of designs1){
        containedItems = []
        for (let design2 of designs2){
            containedItems .push(new ContainedItem("", `${design2} ${design1}`, 'avatar', [
                `${design2} ${design1} 세트`
            ])) 
        }
        
        obj[`${design1} 수영복 선택 상자`] = new LAItem(`${design1} 수영복 선택 상자`, "avatarSetPackage", [], containedItems , true)    
    }


    for (let design1 of designs1){
        for (let design2 of designs2){
            containedItems = []
            for (let rootClass of rootClasses_){
                containedItems.push(new ContainedItem(rootClass, `${design2} ${design1}`, 'avatar', [
                    `${design2} ${design1} 머리_${rootClass}`,
                    `${design2} ${design1} 상의_${rootClass}`,
                    `${design2} ${design1} 하의_${rootClass}`,
                    `${design2} ${design1} 얼굴1_${rootClass}`,
                    `${design2} ${design1} 얼굴2_${rootClass}`,
                ]))
                
            }
            obj[`${design2} ${design1} 세트`] = new LAItem(`${design1} ${design2} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        }
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let design1 of designs1){
        for (let childId of getChildrenId(obj[`${design1} 수영복 선택 상자`])){
            for(let childId_ of getChildrenId(obj[childId])){
                let itemName = childId_.split('_')[0]
                let className = childId_.split('_')[1]
                let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
                obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
            }
        }
    }
    


    // 무기 선택 상자
    designs = ['여름빛', '노을빛', '새벽빛']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["수영복 무기 아바타 선택 상자"] = new LAItem("수영복 무기 아바타 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['수영복 무기 아바타 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    // 악기 선택 상자
    designs = ['여름빛', '노을빛', '새벽빛']
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    containedItems = []
    for (let rootClass of rootClasses_){
        for (design of designs){
            containedItems.push(new ContainedItem(rootClass, `${design}`, 'weapon', [`${rootClassMap[rootClass]}의 ${design} 악기_${rootClass}`]))
        }
    }
    obj["수영복 악기 아바타 선택 상자"] = new LAItem("수영복 악기 아바타 선택 상자", "instrumentPackage", rootClasses_, containedItems, true)
    // 악기

    for (let childId of getChildrenId(obj['수영복 악기 아바타 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'instrument', [className], [], true)
    }



    return obj
}

const Build_omenData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["오멘 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["오멘 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["유령마 선택 상자"]))
    obj["오멘"] = new LAItem("오멘", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '어둠의 오멘',
        '심연의 오멘',
        '욕망의 오멘',
        '종말의 오멘'
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["오멘 아바타 선택 상자"] = new LAItem("오멘 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
            
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`오멘 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // 무기 선택 상자
    designs = ['어둠의', '심연의', '욕망의', '종말의']
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["오멘 무기 선택 상자"] = new LAItem("오멘 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['오멘 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 타락의 유령마',
        '탈 것 : 혼돈의 유령마',
        '탈 것 : 증오의 유령마',
        '탈 것 : 분노의 유령마',
        '탈 것 : 죄악의 유령마'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['유령마 선택 상자'] = new LAItem('유령마 선택 상자', 'mountPackage', [], containedItems, true)



    return obj
}

const Build_runnerData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["스피드 러너 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["인피니티 러너 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["블라썸 러너 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["러너 얼굴 장식 세트"]))
    obj["러너"] = new LAItem("러너", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '스피드 러너',
        '인피니티 러너',
        '블라썸 러너',
    ]

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
            ]))
            
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let design of designs){
        for (let childId_ of getChildrenId(obj[`${design} 아바타 세트`])){
            
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
            
        }
    }
    

    //"러너 얼굴 장식 세트"
    containedItems = []

    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [`${design} 얼굴 장식 세트`]))
    }

    obj[`러너 얼굴 장식 세트`] = new LAItem(`러너 얼굴 장식 세트`, 'avatarSetPackage', rootClasses_, containedItems, true)

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`
            ]))
            
        }
        obj[`${design} 얼굴 장식 세트`] = new LAItem(`${design} 얼굴 장식 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    for (let design of designs){
        for (let childId_ of getChildrenId(obj[`${design} 얼굴 장식 세트`])){
            
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
            
        }
    }

    return obj
}
const Build_2020newyearData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["2020 설빔 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["요호링 펫 선택 상자"]))
    obj["2020년 설빔"] = new LAItem("2020년 설빔", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '연화 설빔',
        '설화 설빔',
        '홍화 설빔',
        
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["2020 설빔 아바타 선택 상자"] = new LAItem("2020 설빔 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`2020 설빔 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }



    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 청의 요호링',
        '펫 : 적의 요호링',
        '펫 : 백의 요호링',
        '펫 : 금의 요호링'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['요호링 펫 선택 상자'] = new LAItem('요호링 펫 선택 상자', 'petPackage', [], containedItems, true)



    return obj
}

const Build_holyknightData = (obj) => {
    //패키지
    let containedItems = []
    
    containedItems.push(new ContainedItem("", "", "avatar", ["성직자와 징벌자 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["심판자의 한손검 상자"]))
    obj["홀리나이트 런칭"] = new LAItem("홀리나이트 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        "수호의 성직자",
        "파괴의 징벌자"
    ]
    for (let design of designs){
        let className = '홀리나이트'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 아바타 세트`]))
    }
    obj["성직자와 징벌자 아바타 선택 상자"] = new LAItem("성직자와 징벌자 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)

    containedItems = []
    for (let design of designs){
        containedItems = []
        let className = '홀리나이트'
        containedItems.push(new ContainedItem(className, design, 'avatar', [`${design} 머리_${className}`, `${design} 상하의_${className}`, `${design.split(' ')[1]}의 한손검_${className}`]))
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', [className], containedItems, true)
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "상의": 'avatar-top',
        "하의": 'avatar-pants',
        "한손검": 'weapon',
        "상하의": 'avatar-onepiece'
    }
    
    for (let childId_ of getChildrenId(obj[`성직자와 징벌자 아바타 선택 상자`])){
        for (let childId of getChildrenId(obj[childId_])){
            let itemName = childId.split('_')[0]
            let className = childId.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }
    // 무기 선택 상자
    designs = [
        '심판자'
    ]
    containedItems = []
    let weapons_ = {'홀리나이트': '한손검'}
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 ${weapons_id[className]}`]))
        }
    }
    obj["심판자의 한손검 상자"] = new LAItem("심판자의 한손검 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['심판자의 한손검 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}

const Build_2019christData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["밤의 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["밤의 무기 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["스노우 바이크 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["크리스마스 펫 선택 상자"]))
    obj["크리스마스 밤의 아바타"] = new LAItem("크리스마스 밤의 아바타", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '고요한 밤',
        '순수한 밤',
        '거룩한 밤'
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design}의 아바타 세트`
        ]))        
    }
    obj["밤의 아바타 선택 상자"] = new LAItem("밤의 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design}의 아바타 세트`] = new LAItem(`${design}의 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`밤의 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // 무기 선택 상자
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 ${weapons_id[className]}`]))
        }
    }
    obj["밤의 무기 선택 상자"] = new LAItem("밤의 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['밤의 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 스노우 바이크 B',
        '탈 것 : 스노우 바이크 G',
        '탈 것 : 스노우 바이크 R'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['스노우 바이크 선택 상자'] = new LAItem('스노우 바이크 선택 상자', 'mountPackage', [], containedItems, true)

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 정열의 페페',
        '펫 : 냉정한 퐁퐁',
        '펫 : 순수한 루루'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['크리스마스 펫 선택 상자'] = new LAItem('크리스마스 펫 선택 상자', 'petPackage', [], containedItems, true)



    return obj
}

const Build_anniv1stData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["아크라시아의 영광 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["아크라시아의 믿음 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["아크라시아의 명예 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["아크라시아의 의지 세트"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["아크라시아의 무기 선택 상자"]))
    obj["1주년 패키지"] = new LAItem("1주년 패키지", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '아크라시아의 영광',
        '아크라시아의 믿음',
        '아크라시아의 명예',
        '아크라시아의 의지'
    ]
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`
            ]))
            
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants'
    }
    for (let design of designs){
        for (let childId_ of getChildrenId(obj[`${design} 세트`])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
            
        }
    
    }
    

    // 무기 선택 상자
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    delete weapons_['홀리나이트']
    designs = ['영광', '명예', '의지']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 ${weapons_id[className]}`]))
        }
    }
    obj["아크라시아의 무기 선택 상자"] = new LAItem("아크라시아의 무기 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['아크라시아의 무기 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    return obj
}

const Build_2019halloweenData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["힙스터 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["힙스터 무기 아바타 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["호박마차 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["할로윈 펫 선택 상자"]))
    obj["할로윈 힙스터"] = new LAItem("할로윈 힙스터", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '악몽의 힙스터',
        '공포의 힙스터',
        '광란의 힙스터'
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 아바타 세트`
        ]))        
    }
    obj["힙스터 아바타 선택 상자"] = new LAItem("힙스터 아바타 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`힙스터 아바타 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    // 무기 선택 상자
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    delete weapons_['홀리나이트']
    designs = [
        '광란',
        '악몽',
        '공포'
    ]
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design}의 ${weapons_id[className]}`]))
        }
    }
    obj["힙스터 무기 아바타 선택 상자"] = new LAItem("힙스터 무기 아바타 선택 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['힙스터 무기 아바타 선택 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 새벽의 호박마차',
        '탈 것 : 밤의 호박마차',
        '탈 것 : 황혼의 호박마차',
        '탈 것 : 노을의 호박마차'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['호박마차 선택 상자'] = new LAItem('호박마차 선택 상자', 'mountPackage', [], containedItems, true)

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 프레디',
        '펫 : 잭',
        '펫 : 제이슨'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['할로윈 펫 선택 상자'] = new LAItem('할로윈 펫 선택 상자', 'petPackage', [], containedItems, true)

    return obj
}
const Build_magicschoolData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["마법학회 교복 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["마법학회 생활복 선택 상자"]))
    obj["마법학회"] = new LAItem("마법학회", "package_type1", [], containedItems , false)


    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '마법학회 교복 A',
        '마법학회 교복 B',
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트`
        ]))        
    }
    obj["마법학회 교복 선택 상자"] = new LAItem("마법학회 교복 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants'
    }
    
    for (let childId of getChildrenId(obj[`마법학회 교복 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    //아바타선택 - 전직업
    containedItems = []
    designs = [
        '마법학회 생활복 A',
        '마법학회 생활복 B'
    ]
    for (let design of designs){
        containedItems.push(new ContainedItem("", design, 'avatar', [
            `${design} 세트`
        ]))        
    }
    obj["마법학회 생활복 선택 상자"] = new LAItem("마법학회 생활복 선택 상자", "avatarSetPackage", [], containedItems , true)


    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상의_${rootClass}`,
                `${design} 하의_${rootClass}`,
                `${design} 얼굴1_${rootClass}`,
                `${design} 얼굴2_${rootClass}`,
            ]))
            
        }
        obj[`${design} 세트`] = new LAItem(`${design} 세트`, 'avatarPackage', rootClasses_, containedItems, true)
    }

    for (let childId of getChildrenId(obj[`마법학회 생활복 선택 상자`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    return obj
}

const Build_faurenzData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["파우렌츠 아바타 세트 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["아우프슈텐 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["프랑소와즈 선택 상자"]))
    obj["파우렌츠 세트"] = new LAItem("파우렌츠 세트", "package_type1", [], containedItems , false)


    //아바타선택 - 전직업
    containedItems = []
    let designs = [
        '파우렌츠'
    ]
    

    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            if (genderFilter(rootClass) === 'f'){
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `${design} 드레스 머리_${rootClass}`,
                    `${design} 드레스 상의_${rootClass}`,
                    `${design} 드레스 하의_${rootClass}`,
                    `${design} 드레스 얼굴1_${rootClass}`,
                ]))
     
            }else{
                containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                    `${design} 턱시도 머리_${rootClass}`,
                    `${design} 턱시도 상의_${rootClass}`,
                    `${design} 턱시도 하의_${rootClass}`,
                    `${design} 턱시도 얼굴1_${rootClass}`,
                ]))
            }
                       
        }
    }
    obj[`파우렌츠 아바타 세트 상자`] = new LAItem(`파우렌츠 아바타 세트 상자`, 'avatarPackage', rootClasses_, containedItems, true)
    
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants'
    }
    for(let childId_ of getChildrenId(obj['파우렌츠 아바타 세트 상자'])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 아우프슈텐 - G',
        '탈 것 : 아우프슈텐 - C',
        '탈 것 : 아우프슈텐 - R',
        '탈 것 : 아우프슈텐 - Y',
        '탈 것 : 아우프슈텐 - B',
        '탈 것 : 아우프슈텐 - S'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['아우프슈텐 선택 상자'] = new LAItem('아우프슈텐 선택 상자', 'mountPackage', [], containedItems, true)

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 영원의 프랑소와즈',
        '펫 : 새침한 프랑소와즈',
        '펫 : 단호한 프랑소와즈'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['프랑소와즈 선택 상자'] = new LAItem('프랑소와즈 선택 상자', 'petPackage', [], containedItems, true)


    return obj
}


const Build_assassinData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["블레이드 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["데모닉 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 선택 상자"]))
    obj["암살자 런칭"] = new LAItem("암살자 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 블레이드
    containedItems = []
    let designs = [
        '절제된 심판'
    ]

    for (let design of designs){
        containedItems = []
        className = '블레이드'
        containedItems.push(new ContainedItem(className, design, 'avatar', [
            `${design}의 머리_${className}`,
            `${design}의 상하의_${className}`,
            `${design}의 검_${className}`,
        ]))
        obj[`블레이드 아바타 세트`] = new LAItem(`블레이드 아바타 세트`, 'avatarPackage', [className], containedItems, true)
        
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        '검': 'weapon',
        '데모닉웨폰': 'weapon',
    }
    
    for(let childId_ of getChildrenId(obj[`블레이드 아바타 세트`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    

    //아바타선택 - 데모닉
    containedItems = []
    designs = [
        '해방된 악마'
    ]

    for (let design of designs){
        containedItems = []
        className = '데모닉'
        containedItems.push(new ContainedItem(className, design, 'avatar', [
            `${design}의 머리_${className}`,
            `${design}의 상하의_${className}`,
            `${design}의 데모닉웨폰_${className}`,
        ]))
        obj[`데모닉 아바타 세트`] = new LAItem(`데모닉 아바타 세트`, 'avatarPackage', [className], containedItems, true)
        
    }

    
    // 아바타
    
    for(let childId_ of getChildrenId(obj[`데모닉 아바타 세트`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }


    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 슈타이페 브리제 - G',
        '탈 것 : 슈타이페 브리제 - P',
        '탈 것 : 슈타이페 브리제 - R',
        '탈 것 : 슈타이페 브리제 - Y',
        '탈 것 : 슈타이페 브리제 - B',
        '탈 것 : 번쩍거리는 먹빛 구름',
        '탈 것 : 차가운 눈빛 구름',
        
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['탈 것 선택 상자'] = new LAItem('탈 것 선택 상자', 'mountPackage', [], containedItems, true)


    return obj
}

const Build_2019swimsuitsData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여'
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["연인 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["청춘 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "weapon", ["수영복 무기 아바타 상자"]))
    containedItems.push(new ContainedItem("", "", "mount", ["2019 여름 탈 것 선택 상자"]))
    containedItems.push(new ContainedItem("", "", "pet", ["2019 여름 펫 선택 상자"]))
    obj["2019 수영복"] = new LAItem("2019 수영복", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    let designs1 = [
        '연인',
        '청춘'
    ]
    
    let designs2 = [
        '바다',
        '여름',
        '해변'
    ]
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    for (let design1 of designs1){
        containedItems = []
        for (let design2 of designs2){
            containedItems.push(new ContainedItem("", `${design2}의 ${design1}`, 'avatar', [
                `${design2}의 ${design1} 아바타 세트`
            ]))        
        }

        obj[`${design1} 아바타 세트`] = new LAItem(`${design1} 아바타 세트`, "avatarSetPackage", [], containedItems , true)
    }

    for (let design1 of designs1){

        for (let design2 of designs2){
            containedItems = []
            for (let rootClass of rootClasses_){
                containedItems.push(new ContainedItem(rootClass, `${design2}의 ${design1}`, 'avatar', [
                    `${design2}의 ${design1} 머리_${rootClass}`,
                    `${design2}의 ${design1} 상의_${rootClass}`,
                    `${design2}의 ${design1} 하의_${rootClass}`,
                    `${design2}의 ${design1} 얼굴1_${rootClass}`,
                    `${design2}의 ${design1} 얼굴2_${rootClass}`,
                    `${rootClassMap[rootClass]}의 ${design1} 악기_${rootClass}`,
                ]))
                
            }
            obj[`${design2}의 ${design1} 아바타 세트`] = new LAItem(`${design2}의 ${design1} 아바타 세트`, 'avatarPackage', rootClasses_, containedItems, true)
            
        }
    }
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument'
    }
    for (let design1 of designs1){
        for (let childId of getChildrenId(obj[`${design1} 아바타 세트`])){
            for(let childId_ of getChildrenId(obj[childId])){
                let itemName = childId_.split('_')[0]
                let className = childId_.split('_')[1]
                let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
                obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
            }
        }
    }
    

    // 무기 선택 상자
    containedItems = []
    let weapons_ = _.cloneDeep(weapons)
    delete weapons_['기상술사']
    delete weapons_['도화가']
    delete weapons_['소서리스']
    delete weapons_['스트라이커']
    delete weapons_['건슬링어']
    delete weapons_['리퍼']
    delete weapons_['스카우터']
    delete weapons_['홀리나이트']
    
    designs = ['해변의 연인', '바다의 청춘', '여름의 추억']
    for (let className in weapons_){
        for (design of designs){
            containedItems.push(new ContainedItem(className, `${design}`, 'weapon', [`${design} ${weapons_id[className]}`]))
        }
    }
    obj["수영복 무기 아바타 상자"] = new LAItem("수영복 무기 아바타 상자", "weaponPackage", Object.keys(weapons_), containedItems, true)
    // 무기

    for (let childId of getChildrenId(obj['수영복 무기 아바타 상자'])){
        let itemName = childId.split('_')[0]
        let className = childId.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId] = new LAItem(itemName, 'weapon', [className], [], true)
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 치프밍고',
        '탈 것 : 썸머밍고',
        '탈 것 : 마린밍고'
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['2019 여름 탈 것 선택 상자'] = new LAItem('2019 여름 탈 것 선택 상자', 'mountPackage', [], containedItems, true)

    //pet
    containedItems = []
    let petNameLst = [
        '펫 : 끼룩이',
        '펫 : 죠세핀',
        '펫 : 라비안',
        '펫 : 다비드'
    ]
    for (let petName of petNameLst){
        containedItems.push(new ContainedItem('', '', 'pet', [petName]))
        obj[petName] = new LAItem(petName, 'pet', [], [], true)
    }
    obj['2019 여름 펫 선택 상자'] = new LAItem('2019 여름 펫 선택 상자', 'petPackage', [], containedItems, true)



    return obj
}

const Build_umarData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["우마르의 역작 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "mount", ["슈타이페 브리제 선택 상자"]))
    obj["우마르의 역작"] = new LAItem("우마르의 역작", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let designMap = {
        '전사': ['지휘자', '투기사', '기사장'],
        '마법사': ['연주자', '인도자', '점술가'],
        '무도가-여': ['개척자', '도전자', '탐험가', '모험가'],
        '헌터-남': ['유랑자', '감시자', '방랑자'],
    }
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    containedItems = []
    for (let rootClass of rootClasses_){
        for (let design of designMap[rootClass]){
            containedItems.push(new ContainedItem("", `우마르의 ${design}`, 'avatar', [
                `우마르의 ${design} 아바타 상자`
            ]))
        }
                
    }

    obj[`우마르의 역작 아바타 세트`] = new LAItem(`우마르의 역작 아바타 세트`, "avatarSetPackage", [], containedItems , true)



    for (let rootClass of rootClasses_){
        for (let design of designMap[rootClass]){
            containedItems = []
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `우마르의 ${design} 머리_${rootClass}`,
                `우마르의 ${design} 상하의_${rootClass}`,
            ]))
            obj[`우마르의 ${design} 아바타 상자`] = new LAItem(`우마르의 ${design} 아바타 상자`, 'avatarPackage', [rootClass], containedItems, true)
        
        }
        
    }
    
    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument'
    }
    for (let childId of getChildrenId(obj[`우마르의 역작 아바타 세트`])){
        for(let childId_ of getChildrenId(obj[childId])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }

    //mount
    containedItems = []
    let mountNameLst = [
        '탈 것 : 슈타이페 브리제 - G',
        '탈 것 : 슈타이페 브리제 - B',
        '탈 것 : 슈타이페 브리제 - Y',
        '탈 것 : 슈타이페 브리제 - R',
        '탈 것 : 슈타이페 브리제 - P',
    ]
    for (let mountName of mountNameLst){
        containedItems.push(new ContainedItem('', '', 'mount', [mountName]))
        obj[mountName] = new LAItem(mountName, 'mount', [], [], true)
    }
    obj['슈타이페 브리제 선택 상자'] = new LAItem('슈타이페 브리제 선택 상자', 'mountPackage', [], containedItems, true)


    return obj
}


const Build_weddingData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["순수한 서약 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "avatar", ["굳건한 축복 아바타 세트"]))
    obj["서약과 축복"] = new LAItem("서약과 축복", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    let designs = ['순수한 서약', '굳건한 축복']

    
    for (let design of designs){
        containedItems = []
        for (let rootClass of rootClasses_){
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
            ]))
        }
        obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, "avatarPackage", rootClasses_, containedItems , true)            
    }

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument'
    }

    
    for (let design of designs){
        for(let childId_ of getChildrenId(obj[`${design} 아바타 세트`])){
            let itemName = childId_.split('_')[0]
            let className = childId_.split('_')[1]
            let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
            obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
        }
    }


    return obj
}



const Build_lancerData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["화안의 미후왕 아바타 세트"]))
    obj["창술사 런칭"] = new LAItem("창술사 런칭", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    let design = '화안의 미후왕'
    let className = '창술사'
    containedItems.push(new ContainedItem(className, design, 'avatar', [
        `${design} 머리_${className}`,
        `${design} 상하의_${className}`,
        `${design} 무기_${className}`,
    ]))

    obj[`${design} 아바타 세트`] = new LAItem(`${design} 아바타 세트`, "avatarPackage", [className], containedItems , true)            


    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument',
        "무기": 'weapon'
    }

    
    for(let childId_ of getChildrenId(obj[`${design} 아바타 세트`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    


    return obj
}


const Build_roseData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["장미 아바타 세트"]))
    obj["장미"] = new LAItem("장미", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    containedItems = []
    for (let rootClass of rootClasses_){
        if (genderFilter(rootClass) === 'm'){
            let design = '검은 장미의 댄서'
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
            ]))
        }else{
            let design = '붉은 장미의 무희'
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
            ]))
        }
        
    }
    obj[`장미 아바타 세트`] = new LAItem(`장미 아바타 세트`, "avatarPackage", rootClasses_, containedItems , true)            
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument'
    }

    
    for(let childId_ of getChildrenId(obj[`장미 아바타 세트`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    


    return obj
}


const Build_2019newyearData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["은가람과 은가비 아바타 세트"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 베른 엘크"]))
    obj["은가람과 은가비"] = new LAItem("은가람과 은가비", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    containedItems = []
    for (let rootClass of rootClasses_){
        if (genderFilter(rootClass) === 'm'){
            let design = '은가람'
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
            ]))
        }else{
            let design = '은가비'
            containedItems.push(new ContainedItem(rootClass, design, 'avatar', [
                `${design} 머리_${rootClass}`,
                `${design} 상하의_${rootClass}`,
            ]))
        }
        
    }
    obj[`은가람과 은가비 아바타 세트`] = new LAItem(`은가람과 은가비 아바타 세트`, "avatarPackage", rootClasses_, containedItems , true)            
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument'
    }

    
    for(let childId_ of getChildrenId(obj[`은가람과 은가비 아바타 세트`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    
    let itemName = '탈 것 : 베른 엘크'
    obj[itemName] = new LAItem(itemName, 'mount', [], [], true)

    return obj
}


const Build_2018christData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["노엘과 이브 아바타 세트 (직업 전용)"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 눈꽃 사슴"]))
    obj["노엘과 이브"] = new LAItem("노엘과 이브", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    
    // 무기 선택 상자
    containedItems = []
    let classes_lst_ = _.cloneDeep(classes_lst)
    classes_lst_ = classes_lst_.filter((e)=>
        e !== '기상술사' && 
        e !== '도화가' && 
        e !== '소서리스' && 
        e !== '스트라이커' && 
        e !== '건슬링어' && 
        e !== '리퍼' && 
        e !== '스카우터' && 
        e !== '홀리나이트' && 
        e !== '블레이드' && 
        e !== '데모닉' && 
        e !== '창술사' 
    )
    let weaponSignitureMap = {
        "버서커": "투쟁", 
        "디스트로이어": "제압", 
        "워로드": "수호", 
        "아르카나": "운명", 
        "서머너": "정령", 
        "바드": "선율",
        "배틀마스터": "맹공", 
        "인파이터": "회심", 
        "기공사": "초월", 
        "호크아이": "역전", 
        "데빌헌터": "심판", 
        "블래스터": "포화", 
    }
    

    containedItems = []
    for (let leafClass of classes_lst_){
        
        if (genderFilter(leafClass) === 'm'){
            design = '노엘'
        }else{
            design = '이브'
        }
        let rootClass = leaf2RootMap[leafClass]
        let classSigniture = rootClassMap[rootClass]
        let weaponSigniture = weaponSignitureMap[leafClass]
        
        containedItems.push(new ContainedItem(leafClass, design, 'avatar', [
            `${classSigniture}의 ${design} 머리_${rootClass}`,
            `${classSigniture}의 ${design} 상하의_${rootClass}`,
            `${classSigniture}의 ${design} 얼굴1_${rootClass}`,
            `${classSigniture}의 ${design} 얼굴2_${rootClass}`,
            `${weaponSigniture}의 ${design} 무기_${leafClass}`,
            `${classSigniture}의 ${design} 악기_${rootClass}`,
        ]))
        
    }
    obj[`노엘과 이브 아바타 세트 (직업 전용)`] = new LAItem(`노엘과 이브 아바타 세트 (직업 전용)`, "avatarPackage", classes_lst_, containedItems , true)            
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument',
        '무기': 'weapon'
    }

    
    for(let childId_ of getChildrenId(obj[`노엘과 이브 아바타 세트 (직업 전용)`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    
    let itemName = '탈 것 : 눈꽃 사슴'
    obj[itemName] = new LAItem(itemName, 'mount', [], [], true)

    return obj
}

const Build_launchData = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' && 
        e !== '무도가-남' &&
        e !== '헌터-여' &&
        e !== '암살자' 
    )
    //패키지
    let containedItems = []
    containedItems.push(new ContainedItem("", "", "avatar", ["런칭 한정 아바타 세트 (직업 전용)"]))
    containedItems.push(new ContainedItem("", "", "mount", ["탈 것 : 디오리카 군마"]))
    obj["런칭 기념 한정 패키지"] = new LAItem("런칭 기념 한정 패키지", "package_type1", [], containedItems , false)

    //아바타선택 - 전직업
    containedItems = []
    
    
    let rootClassMap = {
        '전사': '슈샤이어',
        '마법사': '로헨델',
        '무도가-여': '애니츠',
        '헌터-남': '아르데타인',
        '암살자': '페이튼',
    }
    
    // 무기 선택 상자
    containedItems = []
    let classes_lst_ = _.cloneDeep(classes_lst)
    classes_lst_ = classes_lst_.filter((e)=>
        e !== '기상술사' && 
        e !== '도화가' && 
        e !== '소서리스' && 
        e !== '스트라이커' && 
        e !== '건슬링어' && 
        e !== '리퍼' && 
        e !== '스카우터' && 
        e !== '홀리나이트' && 
        e !== '블레이드' && 
        e !== '데모닉' && 
        e !== '창술사' 
    )
    let leafSignitureMap = {
        "버서커": "투지", 
        "디스트로이어": "의지", 
        "워로드": "기개", 
        "아르카나": "운명", 
        "서머너": "정령", 
        "바드": "기도",
        "배틀마스터": "절개", 
        "인파이터": "신념", 
        "기공사": "영혼", 
        "호크아이": "변화", 
        "데빌헌터": "결심", 
        "블래스터": "믿음", 
    }
    

    containedItems = []
    for (let leafClass of classes_lst_){
        
        
        let rootClass = leaf2RootMap[leafClass]
        let classSigniture = rootClassMap[rootClass]
        let design = leafSignitureMap[leafClass]
        
        containedItems.push(new ContainedItem(leafClass, design, 'avatar', [
            `${classSigniture}의 ${design} 머리_${leafClass}`,
            `${classSigniture}의 ${design} 상의_${leafClass}`,
            `${classSigniture}의 ${design} 하의_${leafClass}`,
            `${classSigniture}의 ${design} 무기_${leafClass}`,
            
        ]))
        
    }
    obj[`런칭 한정 아바타 세트 (직업 전용)`] = new LAItem(`런칭 한정 아바타 세트 (직업 전용)`, "avatarPackage", classes_lst_, containedItems , true)            
    

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument',
        '무기': 'weapon'
    }

    
    for(let childId_ of getChildrenId(obj[`런칭 한정 아바타 세트 (직업 전용)`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    
    let itemName = '탈 것 : 디오리카 군마'
    obj[itemName] = new LAItem(itemName, 'mount', [], [], true)

    return obj
}

const Build_legend1Data = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_ = rootClasses_.filter((e)=>
        e !== '스페셜리스트' 
    )
    let classes_lst_ = _.cloneDeep(classes_lst)
    classes_lst_ = classes_lst_.filter((e)=>
        e !== '기상술사' && 
        e !== '도화가' && 
        e !== '소서리스'
    )
    let weaponMap = {
        "버서커" : ['불타는 불꽃의', '불타는 황혼의'],
        "디스트로이어" : ['빛나는 야수왕의', '칠흑빛 야수왕의'],
        "워로드" : ['태양 지배자의', '달 지배자의'],
        "홀리나이트" : ['굳건한 신념의', '단호한 징벌의'],
        "배틀마스터" : ['집행자의 그림자', '집행자의 영혼'],
        "인파이터" : ['은빛날개의 수호자', '검은날개의 수호자'],
        "기공사" : ['지혜의', '권위의'],
        "창술사" : ['현무의 검은 사모', '현무의 하얀 사모'],
        "데빌헌터" : ['푸른 섬광의', '붉은 섬광의'],
        "블래스터" : ['붉은 오파츠의', '푸른 오파츠의'],
        "호크아이" : ['하얀 까마귀의', '검은 까마귀의'],
        "스카우터" : ['창공의 골드', '창공의 실버'],
        "바드" : ['노래하는 봄의', '노래하는 가을의'],
        "서머너" : ['봄 여신의', '겨울 여신의'],
        "아르카나" : ['밤 카나리아의', '황혼 카나리아의'],
        "블레이드" : ['암흑 사제의', '여명 사제의'],
        "데모닉" : ['붉은 영혼', '푸른 영혼'],
        "리퍼" : ['붉은 달의 영혼', '푸른 달의 영혼'],
        "스트라이커" : ['진노하는 야수', '자애로운 야수'],
        "건슬링어" : ['검은 정벌의', '붉은 정벌의'],
    }
    let designs4Leaf = {
        "버서커" : ['불타는 불꽃의 심장', '불타는 황혼의 심장'],
        "디스트로이어" : ['빛나는 야수왕의 영혼', '칠흑빛 야수왕의 영혼'],
        "워로드" : ['태양 지배자의 의지', '달 지배자의 의지'],
        "홀리나이트" : ['수호자의 굳건한 신념', '수호자의 단호한 징벌'],
        "배틀마스터" : ['집행자의 그림자', '집행자의 영혼'],
        "인파이터" : ['은빛날개의 수호자', '검은날개의 수호자'],
        "기공사" : ['창공 지배자의 지혜', '창공 지배자의 권위'],
        "창술사" : ['현무의 검은 수호자', '현무의 하얀 수호자'],
        "데빌헌터" : ['날카로운 푸른 섬광', '날카로운 붉은 섬광'],
        "블래스터" : ['붉은 오파츠의 흔적', '푸른 오파츠의 흔적'],
        "호크아이" : ['하얀 까마귀의 그림자', '검은 까마귀의 그림자'],
        "스카우터" : ['창공의 골드 윙', '창공의 실버 윙'],
        "바드" : ['노래하는 봄의 귀족', '노래하는 가을의 귀족'],
        "서머너" : ['봄 여신의 눈꽃', '겨울 여신의 눈꽃'],
        "아르카나" : ['밤 카나리아의 날개', '황혼 카나리아의 날개'],
        "블레이드" : ['암흑 사제의 인장', '여명 사제의 인장'],
        "데모닉" : ['붉은 영혼 수확자', '푸른 영혼 수확자'],
        "리퍼" : ['붉은 그림자의 공포', '검은 그림자의 공포'],
        "스트라이커" : ['진노하는 야수 군주', '자애로운 야수 군주'],
        "건슬링어" : ['검은 정벌의 여제', '붉은 정벌의 여제'],
    }
    
    // 블레이드 검 -> 블레이드
    let weapons_id_ = _.cloneDeep(weapons_id)
    weapons_id_['블레이드'] = '블레이드_블레이드'
    //패키지
    let containedItems = []

    for (let leafClass of classes_lst_){
        let weaponDesigns = weaponMap[leafClass]
        let designs = designs4Leaf[leafClass]
        for(let i=0; i<2; i++){
            let design = designs[i]
            let weaponDesign = weaponDesigns[i]
            containedItems.push(new ContainedItem(leafClass, design, 'avatar', [
                `${design} 머리_${leafClass}`,
                `${design} 상의_${leafClass}`,
                `${design} 하의_${leafClass}`,
                `${weaponDesign} ${weapons_id_[leafClass]}`, 
            ]))
        }
    }
    
    obj["전설 아바타 시즌1: 약속"] = new LAItem("전설 아바타 시즌1: 약속", "package_type2", [], containedItems , false)

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument',
        '무기': 'weapon',
        "대검" : "weapon",
        "전투망치" : "weapon",
        "랜스" : "weapon",
        "한손검" : "weapon",
        "덱" : "weapon",
        "스태프" : "weapon",
        "하프" : "weapon",
        "스태프" : "weapon",
        "건틀릿" : "weapon",
        "건틀릿" : "weapon",
        "기공패" : "weapon",
        "창" : "weapon",
        "건틀릿" : "weapon",
        "블레이드" : "weapon",
        "데모닉웨폰" : "weapon",
        "대거" : "weapon",
        "활" : "weapon",
        "총" : "weapon",
        "런처" : "weapon",
        "머신건" : "weapon",
        "총" : "weapon",
        "붓" : "weapon",
        "우산" : "weapon",
    }

    
    for(let childId_ of getChildrenId(obj[`전설 아바타 시즌1: 약속`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    

    return obj
}

const Build_legend2Data = (obj) => {
    let rootClasses_ = _.cloneDeep(rootClasses)
    rootClasses_.push('전사-여')
    let classes_lst_ = _.cloneDeep(classes_lst)
    classes_lst_.push('슬레이어')

    let designs4Leaf = {
        "워로드": ["수호하는 도약", "징벌하는 도약"],
        "디스트로이어": ["빛나는 도약", "침전하는 도약"],
        "버서커": ["금빛 도약", "잿빛 도약"],
        "홀리나이트": ["신성한 도약", "엄중한 도약"],
        "슬레이어": ["맹세의 도약", "복수의 도약"],
        "배틀마스터": ["포용하는 도약", "통솔하는 도약"],
        "인파이터": ["타락한 도약", "찬란한 도약"],
        "기공사": ["파멸하는 도약", "탄생하는 도약"],
        "창술사": ["몰아치는 도약", "온화한 도약"],
        "스트라이커": ["과묵한 도약", "용맹한 도약"],
        "데빌헌터": ["눈부신 도약", "어두운 도약"],
        "블래스터": ["냉혹한 도약", "강인한 도약"],
        "호크아이": ["해방된 도약", "속박된 도약"], 
        "스카우터": ["자비로운 도약", "잔혹한 도약"],
        "건슬링어": ["과감한 도약", "은밀한 도약"],
        "바드": ["우아한 도약", "치명적인 도약"],
        "서머너": ["따스한 도약", "차가운 도약"],
        "아르카나": ["순명하는 도약", "자유로운 도약"],
        "소서리스": ["신비로운 도약", "성장하는 도약"],
        "블레이드": ["강렬한 도약", "은은한 도약"],
        "리퍼": ["잊혀진 도약", "떠도는 도약"],
        "데모닉": ["적색 도약", "자색 도약"],
        "도화가": ["명랑한 도약", "활기찬 도약"],
        "기상술사": ["칠흑의 도약", "순백의 도약"]
    }
    
    // 블레이드 검 -> 블레이드
    let weapons_id_ = _.cloneDeep(weapons_id)
    //패키지
    let containedItems = []

    for (let leafClass of classes_lst_){
        
        let designs = designs4Leaf[leafClass]
        for(let i=0; i<2; i++){
            let design = designs[i]
            
            if(['소서리스', '도화가', '슬레이어', '기상술사'].includes(leafClass)){
                containedItems.push(new ContainedItem(leafClass, design, 'avatar', [
                    `${design} 머리_${leafClass}`,
                    `${design} 상의_${leafClass}`,
                    `${design} 하의_${leafClass}`,
                    `${design} ${weapons_id_[leafClass]}`, 
                ]))
            }else{
                containedItems.push(new ContainedItem(leafClass, design, 'avatar', [
                    `${design} 머리_${leafClass}`,
                    `${design} 상의_${leafClass}`,
                    `${design} 하의_${leafClass}`,
                    `${design}의 ${weapons_id_[leafClass]}`, 
                ]))
            }
            
        }
    }
    
    obj["전설 아바타 시즌2: 도약"] = new LAItem("전설 아바타 시즌2: 도약", "package_type2", [], containedItems , false)

    
    // 아바타
    let avatarPartsNameMap_ = {
        "머리": 'avatar-hat',  
        "얼굴1": 'avatar-face1', 
        "얼굴2": 'avatar-face2', 
        "상의": 'avatar-top',
        "상하의": 'avatar-onepiece',
        "하의": 'avatar-pants',
        "악기": 'instrument',
        '무기': 'weapon',
        "대검" : "weapon",
        "전투망치" : "weapon",
        "랜스" : "weapon",
        "한손검" : "weapon",
        "덱" : "weapon",
        "스태프" : "weapon",
        "하프" : "weapon",
        "스태프" : "weapon",
        "건틀릿" : "weapon",
        "건틀릿" : "weapon",
        "기공패" : "weapon",
        "창" : "weapon",
        "건틀릿" : "weapon",
        "블레이드" : "weapon",
        "데모닉웨폰" : "weapon",
        "대거" : "weapon",
        "활" : "weapon",
        "총" : "weapon",
        "런처" : "weapon",
        "머신건" : "weapon",
        "총" : "weapon",
        "붓" : "weapon",
        "우산" : "weapon",
        "검" : "weapon",
        
    }

    
    for(let childId_ of getChildrenId(obj[`전설 아바타 시즌2: 도약`])){
        let itemName = childId_.split('_')[0]
        let className = childId_.split('_')[1]
        let partsName = itemName.split(' ')[itemName.split(' ').length - 1]
        obj[childId_] = new LAItem(itemName, avatarPartsNameMap_[partsName], [className], [], true) 
    }
    

    return obj
}

const setDesign = (obj) => {
    
    for(let key in obj){
        for(let containedItem of obj[key]['contain']){
            for (let itemId of containedItem['itemIdLst']){
                console.log(JSON.stringify(obj[itemId], null, 4))
                obj[itemId]['design'] = containedItem['design']
            }
        }
    }
    return obj
}


const setId = (obj) => {
    for (key in obj){
        
        obj[key]['id'] = key
    }
    return obj
}
const buildFunctions = [Build_romance, Build_slayer, Build_kinder, Build_2023neria3rd, Build_witcher, Build_anniv4thData, Build_gothicData, Build_2ndNeriaData, Build_2022beachData, Build_DarkPriestData, Build_weatherMancerData, Build_BAMData, Build_1stNeriaData, Build_heavenData, Build_preppyData, Build_2022newyearData, Build_painterData, Build_winterBless, Build_2021_2ndNeriaData, Build_3rdAnnivData, Build_2021_1stNeriaData, Build_glideData, Build_sorceressData, Build_2021summerData, Build_petraniaData, Build_sosData, Build_strikerData, Build_springDreamData, Build_gunslingerData, Build_2021newyearData, Build_festivalData, Build_anniv2ndData, Build_2021halloweenData, Build_reaperData, Build_piratesData, Build_scouterData, Build_swimsuitsData, Build_omenData, Build_runnerData, Build_2020newyearData, Build_holyknightData, Build_2019christData, Build_anniv1stData, Build_2019halloweenData, Build_magicschoolData, Build_faurenzData, Build_assassinData, Build_2019swimsuitsData, Build_umarData, Build_weddingData, Build_lancerData, Build_roseData, Build_2019newyearData, Build_2018christData, Build_launchData, Build_legend1Data, Build_legend2Data]



let p = {}
for (f of buildFunctions){
    p = f(p)
    
}
p = setId(p)
p = setDesign(p)
let fn = "packageItems_const"
let json = JSON.stringify(p, null, 4);
// console.log(json)
fs.writeFileSync(`/home/izjoker/works/LAvatar/apps/LAvatar_back/assets/packageDict/${fn}.json`, json);
