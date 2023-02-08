import _ from 'lodash' 
import ItemCard from './ItemCard'
export default function LeafOverall_Instrument({instruments}) {
    
    const instruments_obj = rearrangeInstruments(instruments)
    return (
        <div className="LeafOverallCategory" id="instrument">
            <pre className="Title">Instrument</pre>
            <div className="Contents">
            {Object.keys(instruments_obj).map((className) => 
                (
                    <div className="LeafCard" id="instrument" key={className} > 
                        <span className="LeafCardClassName">{className}</span>
                        <DesignLayer designs_obj={instruments_obj[className]}/>
                    </div>
                ) 
            )}
            </div>
        </div>
    )
}
function DesignLayer ({designs_obj}){
    
    return (
        <div className="DesignLayer" id="instrument">
            {Object.keys(designs_obj).map((designName) => 
                (
                    <div key={designName}>
                        {/* <span style={{color:'green'}}>{designName}</span> */}
                        <InstrumentCard instrument_obj={designs_obj[designName]}/>
                    </div>
                )
            )}

        </div>
        
    )
}
function InstrumentCard ({instrument_obj}){
    return (
        <div className="IntrumentCard">
            <ItemCard itemSpec={instrument_obj} />
        </div>
        
    )

}

const rearrangeInstruments = (instruments) => {
    let r = {}
    for (let instrument of instruments){
        assigninstrument(r, instrument)
    }
    return r
}
const assigninstrument = (obj, instrument) => {
    let keys = [instrument['target'][0], instrument['design']]
    let lastKeyIdx = keys.length-1
    for (let i=0; i < keys.length-1; i++){
        let key = keys[i]
        if (!obj[key]){
            obj[key] = {}
        }
        obj = obj[key]
    }
    obj[keys[lastKeyIdx]] = instrument
}
