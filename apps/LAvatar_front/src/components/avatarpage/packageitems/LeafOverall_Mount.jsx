import _ from 'lodash' 
import ItemCard from './ItemCard'
export default function LeafOverall_Mount({mounts}) {
    return (
        <div className="LeafOverallCategory" id="mount">
            <span className="Title">Mount</span>
            <div className="Contents">
                <div className="LeafCard" id="mount">
                
                {mounts.map((mount_obj) => (
                    <div key={mount_obj['id']}>
                        <ItemCard itemSpec={mount_obj}/>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}