import { useRecoilState } from 'recoil'
import { packageItems, selectedLeafItemIdState, selectedPackageIdState } from '../../../stores/itemPackageStore.atom'
import PackageItemBoxes from './PackageItemBoxes'
import PackageLeaf from './PackageLeaf'
import LeafOverall from './LeafOverall'
import IconButton from '@mui/material/IconButton';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { blueGrey } from '@mui/material/colors';

function PackageContents({ type }) {
    const [items, setItems] = useRecoilState(packageItems)
    const [selectedLeafItemId, setSelectedLeafItemId] = useRecoilState(selectedLeafItemIdState)
    
    if (type===1){
        
    }
    switch (type) {
        case 1:
            return <div className="PackageType1">
                <PackageItemBoxes type={1} />
                <PackageLeafTitle/>
                {selectedLeafItemId ? <PackageLeaf /> : <LeafOverall />}
            </div>
        case 2:
            return <div className="PackageType2">
                <PackageLeafTitle/>
                <LeafOverall />
            </div>
        case 3:
            return <div className="PackageType3">
                <PackageItemBoxes type={3} />
                <PackageLeafTitle/>
                {selectedLeafItemId ? <PackageLeaf /> : <LeafOverall />}
            </div>


    }

}
export default PackageContents


function PackageLeafTitle() {
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(selectedLeafItemIdState)
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(selectedPackageIdState)
    if (selectedLeafId){
        return <div className="PackageBoxName">
            <IconButton className="ReturnToOverallButton" onClick={() => { setSelectedLeafId(null) }}>
                <ArrowBackSharpIcon sx={{ fontSize: 15, textAlign:'middle', color:blueGrey[50]}} />
            </IconButton>
            
            <span className="SelectedLeafId">
                {selectedLeafId}
            </span>
    </div>

    }
    return <div className="PackageBoxName">
        <span className="SelectedLeafId" style={{marginLeft:"10px"}}>패키지 - {selectedPackageId}</span>
    </div> 
}
