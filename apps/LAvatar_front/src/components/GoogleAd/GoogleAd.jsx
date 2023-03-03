import React, { useEffect } from 'react';

export default function GoogleAd(props) {
    const { dataAdSlot } = props;

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
    }, []);
    return (
        <>
            <ins
                className="adsbygoogle"
                style={{
                    display: 'inline-block',
                    minWidth: '400px',
                    maxWidth: '970px',
                    width: '100%',
                    height: '90px',
                }}
                data-ad-client="ca-pub-4635784520000757"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </>
    );
}
