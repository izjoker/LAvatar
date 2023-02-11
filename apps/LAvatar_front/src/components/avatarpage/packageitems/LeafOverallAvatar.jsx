import ItemCard from './ItemCard';

function LeafOverallAvatar({avatars}) {
    const avatarsObj = rearrangeAvatars(avatars);
    return (
        <div className="LeafOverallCategory" id="avatar">
            <span className="Title">Avatar</span>
            <div className="Contents">
                {Object.keys(avatarsObj).map((className) =>
                    (
                        <div className="LeafCard" id="avatar" key={className}>
                            <span className="LeafCardClassName">{className}</span>
                            <DesignLayer designsObj={avatarsObj[className]}/>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function DesignLayer({designsObj}) {
    return <div className="DesignLayer" id="avatar">

        {Object.keys(designsObj).map((k) => (
            <div key={`${k}_${designsObj[k]['id']}`}>
                <span style={{color: 'green'}}>{k}</span>
                <AvatarCard avatarObj={designsObj[k]}/>
            </div>
        )

        )}
    </div>;
}

function AvatarCard({avatarObj}) {
    return <div className="AvatarLayer" >
        {Object.keys(avatarObj).map((key)=>
            <div key={avatarObj[key]['id']}>
                <ItemCard itemSpec={avatarObj[key]} />
            </div>
        )}
    </div>;
}


const rearrangeAvatars = (avatars) => {
    const r = {};
    for (const avatar of avatars) {
        assignAvatar(r, avatar);
    }
    return r;
};
const assignAvatar = (obj, avatar) => {
    const keys = [avatar['target'][0], avatar['design'], avatar['id']];
    const lastKeyIdx = keys.length-1;
    for (let i=0; i < keys.length-1; i++) {
        const key = keys[i];
        if (!obj[key]) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keys[lastKeyIdx]] = avatar;
};

export default LeafOverallAvatar;
