import _ from 'lodash' 
import ItemCard from './ItemCard'

function LeafOverall_Avatar({avatars}) {
    const avatars_obj = rearrangeAvatars(avatars)
    return (
        <div className="LeafOverallCategory" id="avatar">
            <span className="Title">Avatar</span>
            <div className="Contents">
                {Object.keys(avatars_obj).map((className) => 
                    (
                        <div className="LeafCard" id="avatar" key={className}>
                            <span className="LeafCardClassName">{className}</span>
                            <DesignLayer designs_obj={avatars_obj[className]}/>
                        </div>
                    ) 
                )}
            </div>
        </div>
    )
}

function DesignLayer({designs_obj}) {
    return <div className="DesignLayer" id="avatar">

        {Object.keys(designs_obj).map((k) => (
            <div key={`${k}_${designs_obj[k]['id']}`}>
                <span style={{color:'green'}}>{k}</span>
                <AvatarCard avatar_obj={designs_obj[k]}/>
            </div>
        )
            
        )}
    </div>

}

function AvatarCard({avatar_obj}) {
    return <div className="AvatarLayer" >
        {Object.keys(avatar_obj).map((key)=>
            <div key={avatar_obj[key]['id']}> 
                <ItemCard itemSpec={avatar_obj[key]} />
            </div>
        )}
    </div>
}


const rearrangeAvatars = (avatars) => {
    let r = {}
    for (let avatar of avatars){
        assignAvatar(r, avatar)
    }
    return r
}
const assignAvatar = (obj, avatar) => {
    let keys = [avatar['target'][0], avatar['design'], avatar['id']]
    let lastKeyIdx = keys.length-1
    for (let i=0; i < keys.length-1; i++){
        let key = keys[i]
        if (!obj[key]){
            obj[key] = {}
        }
        obj = obj[key]
    }
    obj[keys[lastKeyIdx]] = avatar
}

export default LeafOverall_Avatar
