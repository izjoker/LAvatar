import { useRecoilState } from 'recoil';
import {
    packageItems,
    selectedLeafItemIdState,
} from '../../../stores/itemPackageStore.atom';
import ItemCard from './ItemCard';

export default function PackageLeaf() {
    const [items, setItems] = useRecoilState(packageItems);
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(
        selectedLeafItemIdState
    );
    const selectedBox = items[selectedLeafId];
    return (
        <div className="PackageLeaf">
            <div className="BoxContents">
                {selectedBox['contain'].map((containedItem, idx) => (
                    <ItemBox key={idx} containedItem={containedItem} />
                ))}
            </div>
        </div>
    );
}
function ItemBox({ containedItem }) {
    const [items, setItems] = useRecoilState(packageItems);
    return (
        <div className="ItemBox">
            {(containedItem['category'] === 'avatar' ||
                containedItem['category'] === 'weapon' ||
                containedItem['category'] === 'instrument' ||
                containedItem['category'] === 'move') && (
                <div>
                    <span
                        className="ClassName"
                        style={{ fontWeight: 'bold', marginRight: '5px' }}
                    >
                        {containedItem['className']}
                    </span>
                    <span className="DesignName">
                        {containedItem['design']}
                    </span>
                </div>
            )}
            {containedItem['itemIdLst'].map((itemId) => (
                <span key={itemId} className="ItemCard">
                    <ItemCard
                        fontSize={'12px'}
                        id={'Leaf'}
                        itemSpec={items[itemId]}
                    />
                </span>
            ))}
        </div>
    );
}
