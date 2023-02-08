import _ from 'lodash' 
import ItemCard from './ItemCard'

export default function LeafOverall_Weapon({weapons}) {
    const weapons_obj = rearrangeWeapons(weapons)
    return (
        <div className="LeafOverallCategory" id="weapon">
            <span className="Title">Weapon</span>
            <div className="Contents">
                {Object.keys(weapons_obj).map((className) => 
                    <div className="LeafCard" id="weapon" key={className} >
                        <span className="LeafCardClassName">{className}</span>
                        <DesignLayer designs_obj={weapons_obj[className]}/>
                    </div>
                )}
            </div>
        </div>
    )
}
function DesignLayer ({designs_obj}){

    return (
        <div className="DesignLayer" id="weapon">
            {Object.keys(designs_obj).map((designName) => 
                (
                    <div key={designName}>
                        {/* <span style={{color:'green'}}>{designName}</span> */}
                        <WeaponCard weapon_obj={designs_obj[designName]}/>
                    </div>
                )
            )}

        </div>
        
    )
}
function WeaponCard ({weapon_obj}){
    return (
        <div className="WeaponCard">
            <ItemCard itemSpec={weapon_obj}/>
        </div>
        
    )

}

const rearrangeWeapons = (weapons) => {
    let r = {}
    for (let weapon of weapons){
        assignWeapon(r, weapon)
    }
    return r
}
const assignWeapon = (obj, weapon) => {
    let keys = [weapon['target'][0], weapon['design']]
    let lastKeyIdx = keys.length-1
    for (let i=0; i < keys.length-1; i++){
        let key = keys[i]
        if (!obj[key]){
            obj[key] = {}
        }
        obj = obj[key]
    }
    obj[keys[lastKeyIdx]] = weapon
}
