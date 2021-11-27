import React from 'react'
import StockCard from "./StockCard";
import {Group, Header, Placeholder, Spinner} from "@vkontakte/vkui";
import {Icon28GhostSimleOutline} from "@vkontakte/icons";

const CommoditiesGroup = (p) => {
    let v;
    let fromPortfolio;
    if(!p.commodities.rates){
        return <Group header={<Header mode={'secondary'}>Товары</Header>}><Spinner/></Group>
    }
    if(Object.keys(p.portfolio).length === 0 && p.p){
        return ''
        // return <Placeholder icon={<Icon56GhostOutline/>} header={<Header>А где? На маркете!</Header>}/>
    }
    if(p.now.length === 0){
        // return ''
        return <Group header={<Header mode={'secondary'}>Товары</Header>}>
            <Placeholder icon={<Icon28GhostSimleOutline width={56} height={56}/>} header={<Header>Нет доступных предложений</Header>}/>
        </Group>
    }
    return <Group header={<Header mode={'secondary'}>Товары</Header>}> {p.now.map(k => {
        v = {
            count: 0,
            avgPrice: 1 / p.commodities.ratesBefore[k],
            ticker: '#'+k
        };
        fromPortfolio = p.portfolio[k];
        if(fromPortfolio){
            v.count = fromPortfolio.count;
            if(p.p){
                v.avgPrice = fromPortfolio.avgPrice;
            }
        }
        if((p.p && v.count !== 0) || !p.p){
            return <StockCard
                avgPrice={v.avgPrice}
                count={p.p || v.count ? v.count : 0}
                price={1 / p.commodities.rates[k]}
                ticker={v.ticker}
                portfolio={p.p}
                setActiveModal={p.s}
                sign={'$'}
                key={k+p.commodities.rates[k]}
            />
        }
        return '';
    })}</Group>
}

export default CommoditiesGroup;