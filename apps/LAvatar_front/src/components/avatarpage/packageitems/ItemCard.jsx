import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import {useState} from 'react';

function ItemCard({itemSpec, id}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const displayItemPrice = (itemSpec) => {
        let r = 0;
        if ('CurrentMinPrice' in itemSpec) {
            r = itemSpec['CurrentMinPrice'];
        } else if (itemSpec['TradeCount'] && 'CurrentMinPrice_3' in
            itemSpec) {
            r = itemSpec['CurrentMinPrice_3'];
        } else if (itemSpec['TradeCount']) {
            r = '*';
        } else {
            r = 'S/O';
        }

        return r.toLocaleString('en-US');
    };
    return (
        <div className="ItemCard" id={id}>
            <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {/* <span className='ItemIcon'>{printIcon(itemSpec)}</span> */}
                <span className='DisplayItemName' style={{marginRight: '5px'}}>
                    {itemSpec['name']}
                </span>
                <span className='DisplayItemPrice' style={
                    {
                        width: '100%',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'rgb(150, 130, 0)',
                    }
                }>
                    {displayItemPrice(itemSpec)}
                </span>
            </div>
            <Popper
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                style={{maxWidth: '550px', fontSize: 'small'}}>
                <Box sx={{border: 1, p: 1, bgcolor: 'background.paper'}}>
                    <PopperContents
                        style={{overflow: 'hidden'}} itemSpec={itemSpec} />
                </Box>
            </Popper>
        </div>
    );
}
export default ItemCard;


function PopperContents({itemSpec}) {
    const r = [];

    function displayWholePrices(itemSpec) {
        const priceLst = [];
        for (let i = 0; i <= 3; i++) {
            try {
                priceLst.push(itemSpec[`CurrentMinPrice_${i}`].toString());
            } catch {
                priceLst.push('S/O');
            }
        }
        return <div key="prices">
            {priceLst.map((price, idx) =>
                <div key={`${itemSpec['id']}_${idx}`}>
                    {idx}회 거래 가능:
                    <span className="DisplayItemPrice">{price}</span>
                </div>
            )}
        </div>;
    }

    r.push(printIcon(itemSpec));
    if (itemSpec['type'].split('-')[0] === 'avatar' ||
        itemSpec['type'] === 'weapon' ||
        itemSpec['type'] === 'instrument') {
        r.push(<div key="targetClass" style={{color: 'red'}}>
            <span className="TargetClass">{itemSpec['target'][0]}</span>
            <span> 사용 가능</span>

        </div>);
        if (itemSpec['TradeCount'] === true) {
            const contents = <div key="prices">{displayWholePrices(itemSpec)}</div>;
            r.push(contents);
        } else if (itemSpec['TradeCount'] === undefined) {
            const contents = <div key="prices">{'재고없음'}</div>;
            r.push(contents);
        } else {
            const contents = <div key="prices">{'거래횟수 무제한'}</div>;
            r.push(contents);
        }
    } else {
        function stringifyTargetLst(target) {
            let r = '';

            if (target.length !== 0) {
                for (const className of target) {
                    r = r+className+', ';
                }
                r = r.slice(0, -2) + ' 사용 가능';
            }
            return r;
        }
        r.push(<div key="targetClass" style={{color: 'red'}}>
            <span className="TargetClass">{
                stringifyTargetLst(itemSpec['target'])
            }</span>

        </div>);

        if (itemSpec['TradeCount'] !== undefined) {
            const contents = <div key="prices">{'거래횟수 무제한'}</div>;
            r.push(contents);
        } else {
            const contents = <div key="prices">{'재고없음'}</div>;
            r.push(contents);
        }
    }
    return r;
}

const printIcon = (itemSpec) => {
    let backgroundImage = '';
    if (itemSpec['grade']) {
        switch (itemSpec['grade']) {
        default:
            backgroundImage = 'linear-gradient(135deg, rgb(49, 49, 49), rgb(88, 88, 88))';
            break;
        case '일반':
            backgroundImage = 'linear-gradient(135deg, rgb(49, 49, 49), rgb(88, 88, 88))';
            break;
        case '고급':
            backgroundImage = 'linear-gradient(135deg, rgb(17, 39, 57), rgb(17, 61, 93))';
            break;
        case '희귀':
            backgroundImage = 'linear-gradient(135deg, rgb(17, 39, 57), rgb(17, 61, 93))';
            break;
        case '영웅':
            backgroundImage = 'linear-gradient(135deg, rgb(46, 18, 60), rgb(72, 13, 93))';
            break;
        case '전설':
            backgroundImage = 'linear-gradient(135deg, rgb(69, 43, 6), rgb(158, 95, 4))';
            break;
        }
    }
    const style = {
        height: '48px',
        width: '48px',
        backgroundImage: backgroundImage,
        border: 'solid',
        borderWidth: '1px',
    };

    return <img key='itemImage' style={style} src={itemSpec['icon'] ? itemSpec['icon'] : '/image/noStock.png'} alt=""/>;
};
