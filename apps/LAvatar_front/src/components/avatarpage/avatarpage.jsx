import {useEffect, useState} from 'react'
import {useRecoilState} from "recoil";
import PackageItemList from './packageitems/PackageItemList'
import {packageItems, selectedLeafItemIdState, selectedPackageIdState} from '../../stores/itemPackageStore.atom';
import './avatarpage.css';
import CustomSnackbar from './reactMaterial/snackBar'
import axios from 'axios'
import PackageList from './PackageList/PackageList'
import {useRef} from 'react';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

  

  
function Avatarpage(props) {
    
    const [items, setItems] = useRecoilState(packageItems)
    const [selectedPackageId, setSelectedPackageId_] = useRecoilState(selectedPackageIdState)
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(selectedLeafItemIdState)
    const [packages, setPackages] = useState(null)
    const [popupVisible, setPopupVisible] = useState(false) 

    const setSelectedPackageId = (selectedPackageId) => {
        setSelectedLeafId(null)
        setSelectedPackageId_(selectedPackageId)
          
        if (items[selectedPackageId] === undefined){
            setPopupVisible(true)
            setSelectedPackageId_(null)
        }
    }
    const handlePackage = (event, newValue) => {
        if (newValue !== null) {
            setSelectedPackageId(newValue)
        }
        
    }
    const getPackages = (items) => {
        console.log(items)
        let r = []
        for (let id in items){
            if(items[id]['type'].split('_')[0] === 'package'){
                r.push(items[id]['id'])
            }
        }
        r = r.reverse()
        return r
    }
    useEffect(() => {
            const reqAPI = async () => {
                const resp = await axios.get('http://localhost:10501/packageDict')
                setItems(resp.data)
                setPackages(getPackages(resp.data))
            }
            reqAPI()
            
        }, []
    )

    const ref = useRef(null);

    useEffect(() => {
        if(!selectedPackageId){
            return
        }
        ref.current.scrollIntoView({
            behavior: 'smooth'});
    }, [selectedPackageId]);

    if (!items){
        return <>Loading..</>
    }
    return (
        
        <div className="AvatarPage">
            <PackageList packages={packages} handler={handlePackage}/>
            <div className="ItemDisplay" ref={ref}> 
                {popupVisible && <CustomSnackbar msg='No Data on this Package' severity='error' setVisibility={setPopupVisible}/>} 
                {items[selectedPackageId] !== undefined && <PackageItemList/>}
            </div>
            <KeyboardDoubleArrowUpIcon className="TopButton" onClick={()=>{
                window.scrollTo({top:0, 
                    behavior: 'smooth'})
            }}/>
        
        </div>
    )
}
export default Avatarpage

