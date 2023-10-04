import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpClient } from '../../utils/http.js';
import ItemPriceView from '../../components/priceHistory/ItemPriceView.jsx';
function PriceHistory(props) {
    const location = window.location.href;
    const [idNums, setIdNums] = useState(null);
    useEffect(() => {
        const reqAPI = async () => {
            const resp = await httpClient.get('/priceHistory');
            setIdNums(resp.data);
        };
        reqAPI();
    }, []);
    if (!idNums) {
        return <>Loading..</>;
    }
    return (
        <div>
            {idNums.map((id) => (
                <Link to={`${id}`} key={id}>
                    <p>{`${id}`}</p>
                </Link>
            ))}
        </div>
    );
}
export default PriceHistory;
