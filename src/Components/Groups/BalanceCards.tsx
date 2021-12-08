import React from 'react'
import {CardScroll, Group, Header} from "@vkontakte/vkui";
import BalanceCard from "../Blocks/BalanceCard";

interface props {
    userValue: {
        rubValue: number,
        usdValue: number,
        eurValue: number,
        lastValue: {
            rub: number,
            usd: number,
            eur: number
        },
        weekStartValue: {
            rub: number,
            usd: number,
            eur: number
        }
    }
}

const BalanceCards = ({userValue}: props) => {
    if(Object.keys(userValue).length < 1){
        return ''
    }
    let q = userValue.rubValue - userValue.weekStartValue.rub;
    let color = Math.abs(q) > 0.01 ? (
        q > 0 ? {color: 'var(--dynamic_green)'} : {color: 'var(--dynamic_red)'}
    ) : {color: 'var(--content_tint_foreground)'};
    return <Group header={<Header mode={"secondary"}>Счет</Header>}>
        <CardScroll>
            <BalanceCard currency="rub" val={userValue.rubValue} color={color} delta={userValue.rubValue - userValue.weekStartValue.rub}/>
            <BalanceCard currency="usd" val={userValue.usdValue} color={color} delta={userValue.usdValue - userValue.weekStartValue.usd}/>
            <BalanceCard currency="eur" val={userValue.eurValue} color={color} delta={userValue.eurValue - userValue.weekStartValue.eur}/>
        </CardScroll>
    </Group>
}

export default BalanceCards;