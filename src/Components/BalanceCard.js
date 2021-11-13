import React from 'react';
import {Card, Text, Title} from "@vkontakte/vkui";

const BalanceCard = (p) => {
    const a = {
        rub: ['рублях', 'Р'],
        usd: ['долларах', '$'],
        eur: ['евро', 'E']
    };
    return <Card style={{padding: 16}}>
        <Text weight={"regular"}>в {a[p.a][0]}</Text>
        <Title level={1} weight={"semibold"}>{(10000/p.b).toFixed(2)} {a[p.a][1]}</Title>
    </Card>
}

export default BalanceCard;