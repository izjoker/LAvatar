import ItemCard from './ItemCard';
export default function LeafOverallPet({pets}) {
    return (
        <div className="LeafOverallCategory" id="pet">
            <span className="Title">Pet</span>

            <div className="Contents">
                <div className="LeafCard" id="pet">
                    {pets.map((petObj) => (
                        <div id="pet" key={petObj['id']}>
                            <ItemCard itemSpec={petObj}/>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
