import React from 'react';
import {Caption, Card, Spinner, Text, Title} from "@vkontakte/vkui";
import RuFormat from "../../Functions/RuFormat";

const BalanceCard = ({currency, val, color, delta}: {currency: string, val: number, color: object, delta: number}) => {
    const a = {
        rub: ['рублях', '₽'],
        usd: ['долларах', '$'],
        eur: ['евро', '€']
    };
    let b;
    if(val){
        b = <div>
            <Title level="1" weight="semibold">{RuFormat(val)} {
                //@ts-ignore
                a[currency][1]
            }</Title>
            <Caption style={{display: 'flex'}} weight="regular" level="1"><div
                style={color}>
                {//@ts-ignore
                RuFormat(delta) + ' '+ a[currency][1]}</div><div style={{width: 4}}
            /><div style={{color: 'var(--content_tint_foreground)'}}>за неделю</div></Caption>
        </div>
    }
    else{
        b = <Spinner style={{height: 28}} size={'regular'}/>
    }
    return <Card style={{padding: 16, width: 'auto'}}>
        <div>
            <Text weight={"regular"}>в
                {// @ts-ignore
                    ' ' + a[currency][0]
                }
            </Text>
            {b}
        </div>
    </Card>
}

export default BalanceCard;