import React from 'react'
import {CardScroll, Group, Header} from "@vkontakte/vkui";
import BalanceCard from "./BalanceCard";

const BalanceCards = (p) => {
    return <Group header={<Header mode={"secondary"}>Счет</Header>}>
        <CardScroll size={"s"}>
            <BalanceCard a={'rub'} b={p.c.rub}/>
            <BalanceCard a={'usd'} b={p.c.usd}/>
            <BalanceCard a={'eur'} b={p.c.eur}/>
        </CardScroll>
    </Group>
}

export default BalanceCards;