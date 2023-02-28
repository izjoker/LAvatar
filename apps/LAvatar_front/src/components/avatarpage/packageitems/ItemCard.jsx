import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import {useState, useEffect} from 'react';
import {useRecoilState} from 'recoil'
import SegmentIcon from '@mui/icons-material/Segment';
import {popperStateRecoil} from '../../../stores/itemPackageStore.atom'

function ItemCard({itemSpec, id, fontSize}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [placement, setPlacement] = useState();
    const [popperState, setPopperState] = useRecoilState(popperStateRecoil);
    const handlePopoverOpen = (newPlacement) => (event) => {
        setPopperState(event.currentTarget)
        setAnchorEl(event.currentTarget);
        setPlacement(newPlacement);
    };
    const handlePopoverClose = () => {
        setPopperState(null)
        setAnchorEl(null)
    };
    const open = popperState === anchorEl && popperState !== null 
    function PopperContents({itemSpec}) {
        function displayWholePrices(itemSpec) {
            let r = []
            if (itemSpec['TradeCount']){
                r.push(<div key="prices">
                {[...Array(4).keys()].map((idx) =>
                    <div key={`${itemSpec['id']}_${idx}`}>
                    {`${idx}회 거래 가능: `}
                        <span className="DisplayItemPrice">{displayItemPrice(idx, itemSpec)}</span>
                        
                    </div>,
                )}
            </div>);
        
            }else if('CurrentMinPrice' in itemSpec){
                r.push(displayItemPrice(null, itemSpec))
                r.push(<div key='tradeCount'>거래횟수 무제한</div>)
            }else{
                r.push(displayItemPrice(null, itemSpec))
            }
            return r
        }
        function stringifyTargetLst(lst){
            let r = ""
            for (const target of lst){
                r += target + ", "
            }
            return r.slice(0,-2)
        }
        const r = [];
        r.push(printIcon(itemSpec));
        if (itemSpec['target'].length){
            r.push(<div key="targetClass" style={{color: 'red'}}>
                <span className="TargetClass">{`${stringifyTargetLst(itemSpec['target'])} 사용 가능`} </span>
            </div>);
        }
        const contents = <div key="prices">{displayWholePrices(itemSpec)}</div>;
        r.push(contents);
        
        if (checkSetCondition(itemSpec)){
            r.push(<div key="clickSign" style={{color:'brown'}}>내용물을 보려면 클릭</div>)
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
    const displayItemPrice = (idx, itemSpec) => {
        let style = {}
        let r = [];
        let priceFlag = true
        let price
        if (idx === null){
            if ('CurrentMinPrice' in itemSpec) {
                price = itemSpec['CurrentMinPrice'].toLocaleString('en-US');
            } else if (itemSpec['TradeCount'] && 'CurrentMinPrice_3' in
                itemSpec) {
                price = itemSpec['CurrentMinPrice_3'].toLocaleString('en-US');
            } else if (itemSpec['TradeCount']) {
                price = <SegmentIcon fontSize={fontSize}/>;
                priceFlag = false
            } else {
                price = '재고없음';
                priceFlag = false
                style['color'] = '#c9c5c5'
            }
        }else{
            if (itemSpec['TradeCount'] && itemSpec[`CurrentMinPrice_${idx}`]){
                price = itemSpec[`CurrentMinPrice_${idx}`].toLocaleString('en-US')
            }else{
                price = '재고없음';
                priceFlag = false
                style['color'] = '#c9c5c5'
            }
        }
        r.push(<span key='price' style={style}>{price}</span>)
        if (priceFlag){
            r.push(
                <span key='GoldIcon' className="GoldIcon" style={{marginLeft: '2px'}}>
                    <GoldIcon fontSize={fontSize}/>
                </span>
            )
        }
        
        return r
    };
    function GoldIcon({fontSize}){
        const unit = 'px'
        const defaultSize = 15
        let width = 15
        let height = 15
        let backgroundSize = [155.5, 128.6]
        let backgroundPosition = [-15.78, -112.1]
        if (fontSize){
            const fontSize_num = parseInt(fontSize)
            const ratio = fontSize_num / defaultSize
            width = width*ratio
            height = height*ratio
            backgroundSize = backgroundSize.map(e=>e*ratio)
            backgroundPosition = backgroundPosition.map(e=>e*ratio)
        }

        let style = {
            width: width+unit,
            height: height+unit,
            background: 'url(https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/sprite/sprite_deal.png) no-repeat 0 0',
            backgroundSize: `${backgroundSize[0]+unit} ${backgroundSize[1]+unit}`,
            display: 'inline-block',
            verticalAlign: 'middle',
            backgroundPosition: `${backgroundPosition[0]+unit} ${backgroundPosition[1]+unit}`,
        }
        return <span 
                className='GoldIcon'
                style={style}/>
    }
    
   
    return <div 
                className="ItemCard" id={id}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen('bottom-start')}
                onMouseLeave={handlePopoverClose}
                style={{fontSize: fontSize}}
            >
                <span key={'DisplayItemName'} className='DisplayItemName' id={id} style={{marginRight: '5px'}}>
                    {itemSpec['name']}
                </span>
                <span key={'DisplayItemPrice'} className='DisplayItemPrice' id={id}>
                    {displayItemPrice(null, itemSpec)}
                </span>
                <Popper
                    open={open}
                    // anchorEl={anchorEl}
                    anchorEl={popperState}
                    placement={placement} 
                    onMouseEnter={handlePopoverClose}
                    style={{maxWidth: '600px', fontSize: fontSize}}>
                    <Box sx={{border: 1, p: 1, bgcolor: 'background.paper'}}>
                        <PopperContents
                            style={{overflow: 'hidden'}} 
                            itemSpec={itemSpec} 
                        />
                    </Box>
                </Popper>
            </div>
}
export default ItemCard;

const checkSetCondition = (itemSpec) => {
    if (
        itemSpec['type'] === 'avatarPackage' ||
        itemSpec['type'] === 'weaponPackage' ||
        itemSpec['type'] === 'instrumentPackage' ||
        itemSpec['type'] === 'mountPackage' ||
        itemSpec['type'] === 'petPackage'
    ) {
        return true;
    }
    return false;
};