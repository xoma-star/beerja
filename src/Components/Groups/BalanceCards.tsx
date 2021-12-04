import React from 'react'
import {CardScroll, Group, Header} from "@vkontakte/vkui";
import BalanceCard from "../Blocks/BalanceCard";

interface props {
    userValue: {
        rubValue: number,
        usdValue: number,
        eurValue: number
    }
}

const BalanceCards = ({userValue}: props) => {
    return <Group header={<Header mode={"secondary"}>Счет</Header>}>
        <CardScroll>
            <BalanceCard currency="rub" val={userValue.rubValue}/>
            <BalanceCard currency="usd" val={userValue.usdValue}/>
            <BalanceCard currency="eur" val={userValue.eurValue}/>
        </CardScroll>
    </Group>
}

export default BalanceCards;