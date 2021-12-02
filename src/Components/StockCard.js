import React from "react";
import {Avatar, Caption, Cell, Spinner, Title} from "@vkontakte/vkui";
import StocksData from "../Functions/StocksData";

const StockCard = (p) => {
    let price = parseFloat(p.price);
    let lots = 1;
    if(price < 10){
        lots = 10;
    }
    if(price < 1){
        lots = 100;
    }
    if(price < 0.1){
        lots = 1000;
    }
    let ticker = p.ticker;
    let avgPrice = parseFloat(p.avgPrice);
    let count = parseFloat(p.count);
    let sign = p.sign;
    let stockData = StocksData[ticker];
    if(!stockData){
        return ''
    }
    let gainPercents = ((price / avgPrice) * 100 - 100);
    let measure = p.measure;
    if(!measure && ticker.indexOf('#') >= 0){
        measure = stockData.measure;
    }
    let gain = price - avgPrice;
    if(count < 0 && p.portfolio){
        gainPercents *= -1;
    }
    const ruFormat = (a) => {
        if(price) return new Intl.NumberFormat('ru-RU').format(a.toFixed(2));
        return ''
    }
    const underName = () => {
        return <Caption
            style={ticker === 'RUBRUB' ? {display: 'none'} : {}}
            level={2}
            weight={"regular"}>
            {`${ruFormat(count)} ${measure} · ${ruFormat(price)} ${sign}`}
        </Caption>
    }
    const rightSide = () => {
        return <div style={{textAlign: "right"}}>
            <Title
                style={{color: 'var(--header_text)'}}
                level={3}
                weight={"medium"}>
                {p.portfolio ? ruFormat(count * price) : ruFormat(price*lots)} {sign}
            </Title>
            <Caption
                style={
                    ticker === 'RUBRUB' ? {display: 'none'} :
                        gain !== 0 ? (
                            (gain * count > 0 && p.portfolio) || (!p.portfolio && gain > 0) ?
                                {color: 'var(--dynamic_green)'} :
                                {color: 'var(--dynamic_red)'}
                        ) : {color: 'var(--dynamic_gray)'}
                }
                level={2}
                weight={"regular"}>
                {p.portfolio ? ruFormat(count * gain) : ruFormat(gain*lots)} {sign} ({ruFormat(gainPercents)}%)
            </Caption>
        </div>
    }
    return <Cell
        onClick={() => {
            p.setActiveModal('stock', {
                ticker: ticker,
                name: stockData.name,
                price: price,
                count: count,
                avgPrice: avgPrice,
                sign: sign,
                description: stockData.description
        })}}
        before={
            <Avatar
                size={32}
                src={require(`../Logos/${stockData.logo}`).default}
            />}
        description={p.portfolio && price ? underName() : ''}
        indicator={
            price ? rightSide() : <Spinner/>}
    >
        <Title level={3} weight={"semibold"}>{stockData.name}</Title>
    </Cell>
}

export default StockCard;