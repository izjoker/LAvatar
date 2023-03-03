import { useRecoilState } from 'recoil';
import {
    packageItems,
    selectedLeafItemIdState,
    selectedPackageIdState,
} from '../../../stores/itemPackageStore.atom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#ffffff',
            contrastText: '#000000',
        },
        neutral: {
            main: '#ffffff',
            contrastText: '#000000',
        },
    },
});
const BorderLessToggleButton = styled(ToggleButton)({
    '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
        borderRadius: '0px !important',
        backgroundColor: 'white',
    },
    '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
        marginLeft: '0px',
    },
});

export default function PackageList({ packages, handler }) {
    const [items, setItems] = useRecoilState(packageItems);
    const [selectedPackageId, setSelectedPackageId_] = useRecoilState(
        selectedPackageIdState
    );

    return (
        <ToggleButtonGroup
            theme={theme}
            exclusive
            onChange={handler}
            value={selectedPackageId}
            className="Packages"
        >
            {packages !== null &&
                packages.map((id) => (
                    <BorderLessToggleButton
                        color="secondary"
                        className="PackageCard"
                        value={id}
                        key={id}
                        style={{ fontSize: '12px' }}
                    >
                        {items[id]['name']}
                    </BorderLessToggleButton>
                ))}
        </ToggleButtonGroup>
    );
}
