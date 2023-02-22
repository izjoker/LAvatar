import ItemCard from './ItemCard';
export default function LeafOverallInstrument({instruments}) {
    const instrumentsObj = rearrangeInstruments(instruments);
    return (
        <div className="LeafOverallCategory" id="instrument">
            <pre className="Title">Instrument</pre>
            <div className="Contents">
                {Object.keys(instrumentsObj).map((className) =>
                    (
                        <div className="LeafCard" id="instrument" key={className} >
                            <span className="LeafCardClassName">{className}</span>
                            <DesignLayer designsObj={instrumentsObj[className]}/>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}
function DesignLayer({designsObj}) {
    return (
        <div className="DesignLayer" id="instrument">
            {Object.keys(designsObj).map((designName) =>
                (
                    <div key={designName}>
                        {/* <span style={{color:'green'}}>{designName}</span> */}
                        <InstrumentCard instrumentObj={designsObj[designName]}/>
                    </div>
                ),
            )}

        </div>

    );
}
function InstrumentCard({instrumentObj}) {
    return (
        <div className="IntrumentCard">
            <ItemCard id={'Leaf'} itemSpec={instrumentObj} />
        </div>

    );
}

const rearrangeInstruments = (instruments) => {
    const r = {};
    for (const instrument of instruments) {
        assigninstrument(r, instrument);
    }
    return r;
};
const assigninstrument = (obj, instrument) => {
    const keys = [instrument['target'][0], instrument['design']];
    const lastKeyIdx = keys.length-1;
    for (let i=0; i < keys.length-1; i++) {
        const key = keys[i];
        if (!obj[key]) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keys[lastKeyIdx]] = instrument;
};
