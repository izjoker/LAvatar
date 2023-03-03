import ItemCard from './ItemCard';
export default function LeafOverallMount({ mounts }) {
    return (
        <div className="LeafOverallCategory" id="mount">
            <span className="Title">Mount</span>
            <div className="Contents">
                <div className="LeafCard" id="mount">
                    {mounts.map((mountObj) => (
                        <div key={mountObj['id']}>
                            <ItemCard
                                fontSize={'12px'}
                                id={'Leaf'}
                                itemSpec={mountObj}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
