import React from 'react'
import StockCard from "../StockCard";
import {Group, Header, Placeholder, Spinner} from "@vkontakte/vkui";
import {Icon28GhostSimleOutline} from "@vkontakte/icons";

const CommoditiesGroup = (p) => {
    let v;
    let fromPortfolio;
    let toMap = p.p ? Object.keys(p.portfolio) : p.now;
    if(!p.commodities.rates){
        return <Group header={<Header mode={'secondary'}>Товары</Header>}><Spinner/></Group>
    }
    if(toMap.length === 0){
        return ''
    }
    if(p.now.length === 0){
        // return ''
        return <Group header={<Header mode={'secondary'}>Товары</Header>}>
            <Placeholder icon={<Icon28GhostSimleOutline width={56} height={56}/>} header={<Header>Нет доступных предложений</Header>}/>
        </Group>
    }
    return <Group header={<Header mode={'secondary'}>Товары</Header>}> {toMap.map(k => {
        v = {
            count: 0,
            avgPrice: 1 / p.commodities.ratesBefore[k],
            ticker: '#'+k
        };
        fromPortfolio = p.portfolio[k];
        let onMarket = true;
        if(fromPortfolio){
            v.count = fromPortfolio.count;
            if(p.p){
                v.avgPrice = fromPortfolio.avgPrice;
                if(p.now.indexOf(k) < 0){
                    onMarket = false;
                }
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
                isOnMarket={onMarket}
            />
        }
        return '';
    })}</Group>
}

export default CommoditiesGroup;