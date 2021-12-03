import {Button, Group, Header, Placeholder, Spinner} from "@vkontakte/vkui";
import StockCard from "./StockCard";
import {Icon56GestureOutline} from "@vkontakte/icons";
import React from "react";

const StockGroup = (p) => {
    let portfolio = p.portfolio;
    let stocksMarket = p.stocksMarket;
    let toMap;
    let isOnMarket;
    if(p.isPortfolio){
        toMap = portfolio;
    }
    else{
        toMap = stocksMarket;
    }
    let loading = p.loading;
    if(loading){
        return <Group header={<Header mode={'secondary'}>Акции</Header>}><Spinner/></Group>
    }
    if(p.isPortfolio && toMap.length === 0){
        return <Group header={<Header mode={'secondary'}>Акции</Header>}>
            <Placeholder
                icon={<Icon56GestureOutline/>}
                header={<Header>Здесь пока пусто</Header>}
                action={<Button onClick={() => p.setActivePanel("quotes")} size={"m"}>К покупкам</Button>}
            />
        </Group>
    }
    if(!p.isPortfolio && toMap.length === 0){
        return <Group header={<Header mode={'secondary'}>Акции</Header>}>
            <Placeholder icon={<Spinner size={'medium'}/>} header={<Header>Загружаем</Header>}/>
        </Group>
    }
    return <Group
        header={<Header mode={"secondary"}>Акции</Header>}
    >
        {toMap.map((v) => {
                let count = portfolio.find(o => o.ticker === v.ticker);
                let w = stocksMarket.find(o => o.ticker === v.ticker);
                isOnMarket = !!w;
                if(typeof(count) !== 'undefined') count = count.count;
                else count = 0;

                return (
                    <StockCard
                        key={v.price+v.ticker+stocksMarket+portfolio}
                        avgPrice={p.isPortfolio ? v.avgPrice : v.priceBefore}
                        count={count}
                        price={v.price}
                        ticker={v.ticker}
                        portfolio={p.isPortfolio}
                        setActiveModal={p.setActiveModal}
                        sign={'$'}
                        measure={'шт.'}
                        isOnMarket={isOnMarket}
                    />
                )
            })
        }
    </Group>
}

export default StockGroup;