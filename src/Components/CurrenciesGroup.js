import React from 'react'
import {Spinner} from "@vkontakte/vkui";
import StockCard from "./StockCard";

const CurrenciesGroup = (p) => {
    if(p.cash.length === 0 || p.rates.length === 0){
        return <Spinner size="large"/>
    }
    let v;
    let s = {
        usd: '$',
        eur: '€',
        rub: '₽',
        gbp: '£',
        chf: '₣'
    }
    return Object.keys(p.cash).map(k => {
        v = p.cash[k];
        if((v.count !== 0 || !p.p) && ((k === 'rub' && p.p) || !(!p.p && k === 'rub'))){
            return <StockCard
                avgPrice={p.p ? v.avgPrice : p.rates[k].valPrev}
                count={p.p || v.count ? v.count : 0}
                price={p.rates[k].val}
                ticker={p.rates[k].ticker}
                portfolio={p.p}
                setActiveModal={p.s}
                sign={'₽'}
                measure={s[k]}
                key={p.rates[k].val+k}
            />
        }
        return '';
    });
}

export default CurrenciesGroup;