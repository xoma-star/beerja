import React from 'react';
import {Card, Spinner, Text, Title} from "@vkontakte/vkui";
import RuFormat from "../../Functions/RuFormat";

const BalanceCard = ({currency, val}: {currency: string, val: number}) => {
    const a = {
        rub: ['рублях', '₽'],
        usd: ['долларах', '$'],
        eur: ['евро', '€']
    };
    let b;
    if(val){
        // @ts-ignore
        b = <Title level="1" weight="semibold">{RuFormat(val)} {a[currency][1]}</Title>
    }
    else{
        b = <Spinner style={{height: 28}} size={'regular'}/>
    }
    return <Card style={{padding: 16, width: 'auto'}}>
        <div>
            <Text weight={"regular"}>в
                {// @ts-ignore
                    a[currency][0]
                }
            </Text>
            {b}
        </div>
    </Card>
}

export default BalanceCard;