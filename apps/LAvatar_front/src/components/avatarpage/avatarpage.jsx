import {useRef, useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import axios from 'axios';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {packageItems, selectedLeafItemIdState, selectedPackageIdState} from '../../stores/itemPackageStore.atom';
import PackageItemList from './packageitems/PackageItemList';
import './avatarpage.css';
import CustomSnackbar from './reactMaterial/snackBar';
import PackageList from './PackageList/PackageList';


function Avatarpage(props) {
    const [items, setItems] = useRecoilState(packageItems);
    const [packages, setPackages] = useState(null);
    const [selectedPackageId, setSelectedPackageId_] = useRecoilState(selectedPackageIdState);
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(selectedLeafItemIdState);
    const [popupVisible, setPopupVisible] = useState(false);

    const setSelectedPackageId = (selectedPackageId) => {
        setSelectedLeafId(null);
        setSelectedPackageId_(selectedPackageId);

        if (items[selectedPackageId] === undefined) {
            setPopupVisible(true);
            setSelectedPackageId_(null);
        }
    };
    const handlePackage = (event, newValue) => {
        if (newValue !== null) {
            setSelectedPackageId(newValue);
        }
    };
    const getPackages = (items) => {
        console.log(items);
        let r = [];
        for (const id in items) {
            if (items[id]['type'].split('_')[0] === 'package') {
                r.push(items[id]['id']);
            }
        }
        r = r.reverse();
        return r;
    };
    useEffect(() => {
        const reqAPI = async () => {
            const resp = await axios.get('http://localhost:10501/packageDict');
            setItems(resp.data);
            setPackages(getPackages(resp.data));
        };
        reqAPI();
    }, [setItems]
    );

    const ref = useRef(null);

    useEffect(() => {
        if (!selectedPackageId) {
            return;
        }
        ref.current.scrollIntoView({
            behavior: 'smooth'});
    }, [selectedPackageId]);

    if (!items) {
        return <>Loading..</>;
    }
    return (

        <div className="AvatarPage">
            <PackageList packages={packages} handler={handlePackage}/>
            <div className="ItemDisplay" ref={ref}>
                {popupVisible && <CustomSnackbar msg='No Data on this Package' severity='error' setVisibility={setPopupVisible}/>}
                {items[selectedPackageId] !== undefined && <PackageItemList/>}
            </div>
            <KeyboardDoubleArrowUpIcon className="TopButton" onClick={()=>{
                window.scrollTo({top: 0,
                    behavior: 'smooth'});
            }}/>

        </div>
    );
}
export default Avatarpage;

