const itemIds = require('./itemIds.json')
let names = []

for (let item in itemIds){
    
    names.push(itemIds[item]['name'])
}
let obj = {}
for (let name of names){
    obj[name] = names.filter(x => x===name).length
}
// console.log(obj)
for (let k in obj){
    if (obj[k]>1){
        console.log(k, obj[k])
    }
}