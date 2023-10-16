import ItemCard from './ItemCard';
export default function LeafOverallMove({ moves }) {
    const movesObj = rearrangemoves(moves);
    return (
        <div className="LeafOverallCategory" id="move">
            <pre className="Title">Move</pre>
            <div className="Contents">
                {Object.keys(movesObj).map((className) => (
                    <div className="LeafCard" id="move" key={className}>
                        <span className="LeafCardClassName">{className}</span>
                        <DesignLayer designsObj={movesObj[className]} />
                    </div>
                ))}
            </div>
        </div>
    );
}
function DesignLayer({ designsObj }) {
    return (
        <div className="DesignLayer" id="move">
            {Object.keys(designsObj).map((designName) => (
                <div key={designName}>
                    <MoveCard moveObj={designsObj[designName]} />
                </div>
            ))}
        </div>
    );
}
function MoveCard({ moveObj }) {
    return (
        <div className="IntrumentCard">
            <ItemCard fontSize={'12px'} id={'Leaf'} itemSpec={moveObj} />
        </div>
    );
}

const rearrangemoves = (moves) => {
    const r = {};
    for (const move of moves) {
        assignmove(r, move);
    }
    return r;
};
const assignmove = (obj, move) => {
    const keys = [move['target'][0], move['design']];
    const lastKeyIdx = keys.length - 1;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!obj[key]) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keys[lastKeyIdx]] = move;
};
