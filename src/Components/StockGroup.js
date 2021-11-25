import {Button, Group, Header, Placeholder, Spinner} from "@vkontakte/vkui";
import StockCard from "./StockCard";
import {Icon56GestureOutline} from "@vkontakte/icons";
import React from "react";

const StockGroup = (p) => {
    let portfolio = p.portfolio;
    let stocksMarket = p.stocksMarket;
    let toMap;
    if(p.isPortfolio){
        toMap = portfolio;
    }
    else{
        toMap = stocksMarket;
    }
    let loading = p.loading;
    return <Group
        header={<Header mode={"secondary"}>Акции</Header>}
    >
        {toMap.length > 0 && !loading ?
            toMap.map((v) => {
                let count = portfolio.find(o => o.ticker === v.ticker);
                if(typeof(count) !== 'undefined') count = count.count;
                else count = 0;
                return (
                    <StockCard
                        key={v.price+v.ticker}
                        avgPrice={p.isPortfolio ? v.avgPrice : v.priceBefore}
                        count={count}
                        price={v.price}
                        ticker={v.ticker}
                        portfolio={p.isPortfolio}
                        setActiveModal={p.setActiveModal}
                        sign={'$'}
                        measure={'шт.'}
                    />
                )
            }) :
            <Placeholder
                icon={!loading ? <Icon56GestureOutline/> : <Spinner size={"large"}/>}
                header={!loading ? <Header>Здесь пока пусто</Header> : ''}
                action={!loading ? <Button onClick={() => p.setActivePanel("quotes")} size={"m"}>К покупкам</Button> : ''}
            />
        }
    </Group>
}

export default StockGroup;