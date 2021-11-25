import React from 'react'
import {CardScroll, Group, Header} from "@vkontakte/vkui";
import BalanceCard from "./BalanceCard";

const BalanceCards = (p) => {
    // console.log(p);
    // if(!p.userValue.usdValue){
    //     return <Spinner/>
    // }
    // let CHFUSD = p.exchangeRates.chf.val / p.exchangeRates.usd.val;
    // let GBPUSD = p.exchangeRates.gbp.val / p.exchangeRates.usd.val;
    // let EURUSD = p.exchangeRates.eur.val / p.exchangeRates.usd.val;
    // let RUBUSD = p.exchangeRates.rub.val / p.exchangeRates.usd.val;
    // let rates = {
    //     usd: 1,
    //     chf: CHFUSD,
    //     gbp: GBPUSD,
    //     eur: EURUSD,
    //     rub: RUBUSD
    // }
    // let usdValue = 0;
    // p.portfolio.forEach(v => {
    //     usdValue += v.price * v.count;
    // });
    // for (const [k, v] of Object.entries(p.cash)) {
    //     usdValue += v.count * rates[k];
    // }
    // let eurValue = usdValue / EURUSD;
    // let rubValue = usdValue / RUBUSD;

    return <Group header={<Header mode={"secondary"}>Счет</Header>}>
        <CardScroll>
            <BalanceCard a={'rub'} b={p.userValue.rubValue}/>
            <BalanceCard a={'usd'} b={p.userValue.usdValue}/>
            <BalanceCard a={'eur'} b={p.userValue.eurValue}/>
        </CardScroll>
    </Group>
}

export default BalanceCards;