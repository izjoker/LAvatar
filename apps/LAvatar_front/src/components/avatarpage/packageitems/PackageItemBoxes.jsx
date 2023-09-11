import { useRecoilState } from 'recoil';
import {
    packageItems,
    selectedLeafItemIdState,
    selectedPackageIdState,
} from '../../../stores/itemPackageStore.atom';
import ItemCard from './ItemCard';
import _ from 'lodash';

export default function PackageItemBoxes({ type }) {
    const [items, setItems] = useRecoilState(packageItems);
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(
        selectedPackageIdState
    );
    const selectedPackage = items[selectedPackageId];
    const categories = ['avatar', 'weapon', 'instrument', 'mount', 'pet'];
    const categorizedBoxes = (function (packageSpec, categories) {
        const r = {};
        for (const containedItem of packageSpec['contain']) {
            if (r[containedItem['category']] === undefined) {
                r[containedItem['category']] = [];
            }
            r[containedItem['category']] = r[containedItem['category']].concat(
                containedItem['itemIdLst']
            );
        }

        return r;
    })(selectedPackage, categories);

    function getChild(itemSpec) {
        return _.map(itemSpec.contain, (container) => {
            return _.map(container.itemIdLst, (id) => {
                const itemObj = items[id];
                return itemObj;
            });
        });
    }

    function ItemView({ itemSpec, depth }) {
        const [selectedLeafItemId, setSelectedLeafItemId] = useRecoilState(
            selectedLeafItemIdState
        );
        const checkBoxLeaf = (itemSpec) => {
            if (type === 1) {
                if (itemSpec['contain'].length === 0 && depth > 0) {
                    return true;
                }
            } else if (type === 3) {
                if (itemSpec['contain'].length === 0) {
                    return true;
                }
            }
            return false;
        };
        const checkSetCondition = (packageId) => {
            if (
                items[packageId]['type'] === 'avatarPackage' ||
                items[packageId]['type'] === 'weaponPackage' ||
                items[packageId]['type'] === 'instrumentPackage' ||
                items[packageId]['type'] === 'mountPackage' ||
                items[packageId]['type'] === 'petPackage'
            ) {
                return true;
            }
            return false;
        };
        const onPackageId = (packageId) => {
            if (checkSetCondition(packageId)) {
                setSelectedLeafItemId(packageId);
            }
        };

        try {
            if (checkBoxLeaf(itemSpec, depth)) {
                return <></>;
            }

            if (depth === 0) {
            }
            let children = _.compact(_.flatten(getChild(itemSpec)));
            let style = depth == 0 ? {} : { marginLeft: `15px` };
            children = [...new Set(children)];

            return (
                <div
                    className={`ItemView_${depth}`}
                    onClick={(e) => {
                        onPackageId(itemSpec.id);
                        e.stopPropagation();
                    }}
                    style={style}
                >
                    <ItemCard
                        fontSize={'12px'}
                        {...(checkSetCondition(itemSpec['id'])
                            ? { className: 'UnfoldableBox' }
                            : {})}
                        id={'Box'}
                        itemSpec={itemSpec}
                    />
                    {_.map(children, (c) => (
                        <ItemView
                            key={`${c.id}_${depth}`}
                            itemSpec={c}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            );
        } catch (e) {
            console.log(e);
            return (
                <div>failed to render itemSpec {JSON.stringify(itemSpec)}</div>
            );
        }
    }

    return (
        <div className="PackageBoxes">
            {Object.keys(categorizedBoxes).map((category) => (
                <div key={category} className="BoxCategory">
                    <div
                        key={'categoryName'}
                        style={{ fontWeight: 'bold', marginLeft: '5px' }}
                    >
                        {capitalizeFirstChar(category)}
                    </div>
                    <div key={'contents'} className="PackageBox" id={category}>
                        {categorizedBoxes[category].map((boxId) => (
                            <ItemView
                                key={boxId}
                                itemSpec={items[boxId]}
                                depth={0}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function capitalizeFirstChar(str) {
    return str.charAt(0).toUpperCase() + str.substring(1, str.length);
}
