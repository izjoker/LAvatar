import { useRecoilState } from 'recoil';
import {
    packageItems,
    selectedLeafItemIdState,
    selectedPackageIdState,
} from '../../../stores/itemPackageStore.atom';
import PackageItemBoxes from './PackageItemBoxes';
import PackageLeaf from './PackageLeaf';
import LeafOverall from './LeafOverall';
import IconButton from '@mui/material/IconButton';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { blueGrey } from '@mui/material/colors';
export default function PackageItemList({ ref_ }) {
    const [selectedLeafItemId, setSelectedLeafItemId] = useRecoilState(
        selectedLeafItemIdState
    );
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(
        selectedPackageIdState
    );
    const [items, setItems] = useRecoilState(packageItems);

    switch (items[selectedPackageId]['type']) {
        default:
            return <div>Package Type Error!</div>;
        case 'package_type1':
            return (
                <div className="PackageContents" ref={ref_} id="Type1">
                    <PackageItemBoxes type={1} />
                    <PackageLeafTitle />
                    {selectedLeafItemId ? <PackageLeaf /> : <LeafOverall />}
                </div>
            );
        case 'package_type2':
            return (
                <div className="PackageContents" ref={ref_} id="Type2">
                    <PackageLeafTitle />
                    <LeafOverall />
                </div>
            );
        case 'package_type3':
            return (
                <div className="PackageContents" ref={ref_} id="Type3">
                    <PackageItemBoxes type={3} />
                    <PackageLeafTitle />
                    {selectedLeafItemId ? <PackageLeaf /> : <LeafOverall />}
                </div>
            );
    }
}

function PackageLeafTitle() {
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(
        selectedLeafItemIdState
    );
    const [selectedPackageId, setSelectedPackageId] = useRecoilState(
        selectedPackageIdState
    );
    if (selectedLeafId) {
        return (
            <div className="PackageBoxName">
                <IconButton
                    className="ReturnToOverallButton"
                    onClick={() => {
                        setSelectedLeafId(null);
                    }}
                >
                    <ArrowBackSharpIcon
                        sx={{
                            fontSize: 15,
                            textAlign: 'middle',
                            color: blueGrey[50],
                        }}
                    />
                </IconButton>

                <span className="SelectedLeafId">{selectedLeafId}</span>
            </div>
        );
    }
    return (
        <div className="PackageBoxName">
            <span className="SelectedLeafId" style={{ marginLeft: '10px' }}>
                패키지 - {selectedPackageId}
            </span>
        </div>
    );
}
