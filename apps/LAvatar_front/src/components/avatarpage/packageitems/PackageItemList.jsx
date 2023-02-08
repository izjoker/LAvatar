import _ from 'lodash';
import { useRecoilState } from 'recoil'
import PackageContents from './PackageContents'
import { packageItems, selectedPackageIdState } from '../../../stores/itemPackageStore.atom';

function PackageItemList(props) {
    const [items, setItems] = useRecoilState(packageItems)
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(selectedPackageIdState)
    const selectedPackage = items[selectedPackageId]


    return (
        <div style={{ textAlign: 'left' }}>
            {/* type1: 상자 포함 패키지
                type2: 상자 미포함 패키지 
                type3: 상자 포함, 상자 외 단품아이템 존재
            */}
            {selectedPackage['type'] === 'package_type1' && <PackageContents type={1} />}
            {selectedPackage['type'] === 'package_type2' && <PackageContents type={2} />}
            {selectedPackage['type'] === 'package_type3' && <PackageContents type={3} />}
        </div>

    )


}

export default PackageItemList
