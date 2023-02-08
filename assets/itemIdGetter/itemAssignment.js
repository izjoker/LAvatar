const fs = require('fs')
const itemSpecs = require('./itemIds.json')
const items = require('./avatarItems.json')

for(let id in itemSpecs){
    try{
        items[id] = Object.assign(items[id], itemSpecs[id])
    }catch(e){
        console.log(`no Data for this id: ${id}`)
    }
}

fs.writeFileSync('assignedItems.json', JSON.stringify(items, null, 4), (err)=>{})
