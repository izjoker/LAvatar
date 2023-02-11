import ItemCard from './ItemCard';

export default function LeafOverallWeapon({weapons}) {
    const weaponsObj = rearrangeWeapons(weapons);
    return (
        <div className="LeafOverallCategory" id="weapon">
            <span className="Title">Weapon</span>
            <div className="Contents">
                {Object.keys(weaponsObj).map((className) =>
                    <div className="LeafCard" id="weapon" key={className} >
                        <span className="LeafCardClassName">{className}</span>
                        <DesignLayer designsObj={weaponsObj[className]}/>
                    </div>
                )}
            </div>
        </div>
    );
}
function DesignLayer({designsObj}) {
    return (
        <div className="DesignLayer" id="weapon">
            {Object.keys(designsObj).map((designName) =>
                (
                    <div key={designName}>
                        {/* <span style={{color:'green'}}>{designName}</span> */}
                        <WeaponCard weaponObj={designsObj[designName]}/>
                    </div>
                )
            )}

        </div>

    );
}
function WeaponCard({weaponObj}) {
    return (
        <div className="WeaponCard">
            <ItemCard itemSpec={weaponObj}/>
        </div>

    );
}

const rearrangeWeapons = (weapons) => {
    const r = {};
    for (const weapon of weapons) {
        assignWeapon(r, weapon);
    }
    return r;
};
const assignWeapon = (obj, weapon) => {
    const keys = [weapon['target'][0], weapon['design']];
    const lastKeyIdx = keys.length-1;
    for (let i=0; i < keys.length-1; i++) {
        const key = keys[i];
        if (!obj[key]) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keys[lastKeyIdx]] = weapon;
};
