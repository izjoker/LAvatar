import {useRecoilState} from 'recoil';
import {packageItems, selectedLeafItemIdState, selectedPackageIdState} from '../../../stores/itemPackageStore.atom';
import {useState} from 'react';
import ItemCard from './ItemCard';

export default function PackageLeaf() {
    const [items, setItems] = useRecoilState(packageItems);
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(selectedLeafItemIdState);
    const selectedBox = items[selectedLeafId];
    return <div className="PackageLeaf">
        <div className="PackageContents">
            {selectedBox['contain'].map((containedItem, idx) =>
                <div className="ItemBox" key={idx}>
                    <ItemBox containedItem={containedItem} />
                </div>
            )}
        </div>
    </div>;
}
function ItemBox({containedItem}) {
    const [items, setItems] = useRecoilState(packageItems);
    return <div>
        {
            (containedItem['category'] === 'avatar' || containedItem['category'] === 'weapon' || containedItem['category'] === 'instrument') &&
            <div>
                <span className="ClassName" style={{fontWeight: 'bold', marginRight: '5px'}}>
                    {containedItem['className']}
                </span>
                <span className="DesignName">
                    {containedItem['design']}
                </span>
            </div>

        }

        {containedItem['itemIdLst'].map((itemId) =>
            <span key={itemId} className="ItemCard">
                <ItemCard itemSpec={items[itemId]} />
            </span>
        )}
    </div>;
}
