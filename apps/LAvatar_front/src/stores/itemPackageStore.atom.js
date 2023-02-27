import {atom} from 'recoil'

export const packageItems = atom({
    key: 'item_specs_contained_in_packages',
    default: null,
});

export const selectedPackageIdState = atom({
    key: 'item_package_selected_package_id',
    default: null,
});

export const selectedLeafItemIdState = atom({
    key: 'item_package_selected_leaf_item_id',
    default: null,
});

export const popperStateRecoil = atom({
    key: 'popper_state',
    default: null,
})