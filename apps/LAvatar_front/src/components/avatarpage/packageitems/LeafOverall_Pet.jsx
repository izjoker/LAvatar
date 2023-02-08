import _ from 'lodash' 
import ItemCard from './ItemCard'
export default function LeafOverall_Pet({pets}) {
    return (
        <div className="LeafOverallCategory" id="pet">
            <span className="Title">Pet</span>

            <div className="Contents">
                <div className="LeafCard" id="pet">
                {pets.map((pet_obj) => (
                    <div id="pet" key={pet_obj['id']}>
                        <ItemCard itemSpec={pet_obj}/>
                    </div>
                    
                ))}
                </div>
            </div>
        </div>
    )
}