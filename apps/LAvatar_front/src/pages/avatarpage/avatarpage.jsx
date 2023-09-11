import { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {
    packageItems,
    selectedLeafItemIdState,
    selectedPackageIdState,
} from '../../stores/itemPackageStore.atom';
import PackageItemList from '../../components/avatarpage/packageitems/PackageItemList';
import './avatarpage.css';
import PackageList from '../../components/avatarpage/PackageList/PackageList';
import { convertMsToTime } from '../../utils/utils.js';
import { httpClient } from '../../utils/http.js';

function Avatarpage(props) {
    const [date, setDate] = useState(null);
    const [items, setItems] = useRecoilState(packageItems);
    const [packages, setPackages] = useState(null);
    const [selectedPackageId, setSelectedPackageId_] = useRecoilState(
        selectedPackageIdState
    );
    const [selectedLeafId, setSelectedLeafId] = useRecoilState(
        selectedLeafItemIdState
    );
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
        let r = [];
        for (const id in items) {
            console.log(id, items[id]);
            if (items[id]['type'].split('_')[0] === 'package') {
                r.push(items[id]['id']);
            }
        }
        r = r.reverse();
        return r;
    };
    const periodFrom = (stringDate) => {
        const date = new Date(stringDate);
        const now = new Date();
        let sub = 0;
        sub = now - date;
        const periodMap = convertMsToTime(sub);
        for (const key in periodMap) {
            if (periodMap.hasOwnProperty(key)) {
                if (periodMap[key] !== 0 || key === 'seconds') {
                    return `${periodMap[key].toString()} ${key} ago`;
                }
            }
        }

        return JSON.stringify(convertMsToTime(sub));
    };
    useEffect(() => {
        const reqAPI = async () => {
            const resp = await httpClient.get('/packageDict');
            setItems(resp.data['datas']);
            setPackages(getPackages(resp.data['datas']));
            setDate(resp.data['updatedAt']);
        };
        reqAPI();
    }, [setItems]);

    const ref = useRef(null);

    useEffect(() => {
        if (!selectedPackageId) {
            return;
        }
        ref.current.scrollIntoView({
            behavior: 'smooth',
        });
    }, [selectedPackageId]);

    if (!items) {
        return <>Loading..</>;
    }
    return (
        <div className="AvatarPage">
            {date && (
                <div className="DataUpdatedAt">
                    Data Update: {periodFrom(date)}
                </div>
            )}
            <PackageList packages={packages} handler={handlePackage} />
            {items[selectedPackageId] !== undefined && (
                <PackageItemList ref_={ref} />
            )}
            <KeyboardDoubleArrowUpIcon
                className="TopButton"
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                    height: '25px',
                    width: '25px',
                }}
            />
        </div>
    );
}
export default Avatarpage;
