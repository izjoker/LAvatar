
import { useRecoilState } from 'recoil'
import { packageItems, selectedPackageIdState } from '../../../stores/itemPackageStore.atom'
import LeafOverall_Avatar from './LeafOverall_Avatar'
import LeafOverall_Weapon from './LeafOverall_Weapon'
import LeafOverall_Instrument from './LeafOverall_Instrument'
import LeafOverall_Mount from './LeafOverall_Mount'
import LeafOverall_Pet from './LeafOverall_Pet'

function LeafOverall(props) {
    const [items, setItems] = useRecoilState(packageItems)
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(selectedPackageIdState)
    const leafItems = [...new Set(searchLeafs(items[selectedPackageId], []))]
    const leafMap = categorizeLeafs(leafItems)

    function searchLeafs (item, leafItemLst) {
        if (item['contain'].length === 0) {
            leafItemLst.push(item)
            return
        }
        for (let child of getChildren(item)) {
            searchLeafs(child, leafItemLst)
        }
        return leafItemLst
    }
    function getChildren (item){
        let r = []
        for (let containedItem of item['contain']) {
            for (let childId of containedItem['itemIdLst']) {
                let child = items[childId]
                r.push(child)
            }
        }
        return r
    }
    function categorizeLeafs (leafItems) {
        let r = {
            "avatar": [],
            "weapon": [],
            "instrument": [],
            "mount": [],
            "pet": [],
        }

        for (let leafItem of leafItems) {
            if (leafItem['type'].includes('avatar')) {
                r['avatar'].push(leafItem)
            } else if (leafItem['type'] === "weapon") {
                r['weapon'].push(leafItem)
            } else if (leafItem['type'] === "instrument") {
                r['instrument'].push(leafItem)
            } else if (leafItem['type'] === "mount") {
                r['mount'].push(leafItem)
            } else if (leafItem['type'] === "pet") {
                r['pet'].push(leafItem)
            }
        }
        return r
    }

    return (
        <div className="LeafOverall">
            {leafMap['avatar'].length !== 0 && <LeafOverall_Avatar avatars={leafMap['avatar']} />}
            {leafMap['weapon'].length !== 0 && <LeafOverall_Weapon weapons={leafMap['weapon']} />}
            {leafMap['instrument'].length !== 0 && <LeafOverall_Instrument instruments={leafMap['instrument']} />}
            {leafMap['mount'].length !== 0 && <LeafOverall_Mount mounts={leafMap['mount']} />}
            {leafMap['pet'].length !== 0 && <LeafOverall_Pet pets={leafMap['pet']} />}
        </div>
    )
}
export default LeafOverall
