import React from 'react';
import {Card, Spinner, Text, Title} from "@vkontakte/vkui";

const BalanceCard = (p) => {
    const a = {
        rub: ['рублях', '₽'],
        usd: ['долларах', '$'],
        eur: ['евро', '€']
    };
    let b;
    if(p.b){
        b = <Title level={1} weight={"semibold"}>{new Intl.NumberFormat('ru-RU').format(p.b.toFixed(2))} {a[p.a][1]}</Title>
    }
    else{
        b = <Spinner style={{height: 28}} size={'regular'}/>
    }
    return <Card style={{padding: 16, width: 'auto'}}>
        <div>
            <Text weight={"regular"}>в {a[p.a][0]}</Text>
            {b}
        </div>
    </Card>
}

export default BalanceCard;