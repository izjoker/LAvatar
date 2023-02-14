const itemSpecs = require('../itemIdGetter/itemSpecs.json');
const partsMap = {
    '0': 'weapon',
    '1': 'avatar-hat',
    '2': 'avatar-top',
    '3': 'avatar-pants',
    '4': 'avatar-face1',
    '5': 'avatar-face2',
    '6': 'instrument',
};
const classIdMap = {
    '10': '전사',
    '20': '마법사',
    '30': '무도가-여',
    '35': '무도가-남',
    '40': '암살자',
    '50': '헌터-남',
    '55': '헌터-여',
    '60': '스페셜리스트',
    '11': '버서커',
    '12': '디스트로이어',
    '13': '워로드',
    '14': '홀리나이트',
    '21': '아르카나',
    '22': '서머너',
    '23': '바드',
    '24': '소서리스',
    '31': '배틀마스터',
    '32': '인파이터',
    '33': '기공사',
    '34': '창술사',
    '36': '스트라이커',
    '41': '블레이드',
    '42': '데모닉',
    '43': '리퍼',
    '51': '호크아이',
    '52': '데빌헌터',
    '53': '블래스터',
    '54': '스카우터',
    '56': '건슬링어',
    '61': '도화가',
    '62': '스페셜리스트',
};
// const numId2String = (itemId_num) => {
//     if (typeof(itemId) === 'string'){
//         let itemName = itemId.split('_')[0]
//         let className = itemId.split('_')[1]
//         return findId(itemName, className)
//     } else {
//         return itemId
//     }
// }
const getStringId = (itemSpec) => {
    const itemId_num = itemSpec['id_num'];
    let suffix = '';
    if (300000000 <= itemId_num && itemId_num <= 399999999) {
        const classIdentifier = itemId_num.toString().substr(2, 2);
        const partsIdentifier = itemId_num.toString()[1];
        const className = classIdMap[classIdentifier];
        const partsName = partsMap[partsIdentifier];
        suffix = '_'+className;
    }
    return itemSpec['name']+suffix;
};

function findAllIdsByName(object, name) {
    const r = [];
    for (const key in object) {
        if (object[key]['name'] === name) {
            r.push(object[key]['id']);
        }
    }
    return r;
}
function classificateByClassName(idLst, className) {
    for (let itemId of idLst) {
        itemId = itemId.toString();
        const classId = itemId.slice(0, 3);
        const className_ = classIds[classId];
        if (className_ === className) {
            return itemId;
        }
    }
}
const findId = (itemName, className) => {
    const idLst = findAllIdsByName(itemIds, itemName);
    if (idLst.length === 0) {
        // console.log('no Name matchs!');
        return itemName;
    }
    return classificateByClassName(idLst, className);
};

for (const numId of Object.keys(itemSpecs)) {
    // console.log(getStringId(itemSpecs[numId]));
}
