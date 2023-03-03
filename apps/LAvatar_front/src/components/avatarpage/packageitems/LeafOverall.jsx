import { useRecoilState } from 'recoil';
import {
    packageItems,
    selectedPackageIdState,
} from '../../../stores/itemPackageStore.atom';
import LeafOverallAvatar from './LeafOverallAvatar';
import LeafOverallWeapon from './LeafOverallWeapon';
import LeafOverallInstrument from './LeafOverallInstrument';
import LeafOverallMount from './LeafOverallMount';
import LeafOverallPet from './LeafOverallPet';

function LeafOverall(props) {
    const [items, setItems] = useRecoilState(packageItems);
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(
        selectedPackageIdState
    );
    const leafItems = [...new Set(searchLeafs(items[selectedPackageId], []))];
    const leafMap = categorizeLeafs(leafItems);

    function searchLeafs(item, leafItemLst) {
        if (item['contain'].length === 0) {
            leafItemLst.push(item);
            return;
        }
        for (const child of getChildren(item)) {
            searchLeafs(child, leafItemLst);
        }
        return leafItemLst;
    }
    function getChildren(item) {
        const r = [];
        for (const containedItem of item['contain']) {
            for (const childId of containedItem['itemIdLst']) {
                const child = items[childId];
                r.push(child);
            }
        }
        return r;
    }
    function categorizeLeafs(leafItems) {
        const r = {
            avatar: [],
            weapon: [],
            instrument: [],
            mount: [],
            pet: [],
        };

        for (const leafItem of leafItems) {
            if (leafItem['type'].includes('avatar')) {
                r['avatar'].push(leafItem);
            } else if (leafItem['type'] === 'weapon') {
                r['weapon'].push(leafItem);
            } else if (leafItem['type'] === 'instrument') {
                r['instrument'].push(leafItem);
            } else if (leafItem['type'] === 'mount') {
                r['mount'].push(leafItem);
            } else if (leafItem['type'] === 'pet') {
                r['pet'].push(leafItem);
            }
        }
        return r;
    }

    return (
        <div className="LeafOverall">
            {leafMap['avatar'].length !== 0 && (
                <LeafOverallAvatar avatars={leafMap['avatar']} />
            )}
            {leafMap['weapon'].length !== 0 && (
                <LeafOverallWeapon weapons={leafMap['weapon']} />
            )}
            {leafMap['instrument'].length !== 0 && (
                <LeafOverallInstrument instruments={leafMap['instrument']} />
            )}
            {leafMap['mount'].length !== 0 && (
                <LeafOverallMount mounts={leafMap['mount']} />
            )}
            {leafMap['pet'].length !== 0 && (
                <LeafOverallPet pets={leafMap['pet']} />
            )}
        </div>
    );
}
export default LeafOverall;
