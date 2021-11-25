import {Card, CardGrid, Cell, Group, Header, List, Switch} from "@vkontakte/vkui";
import React from "react";

const MarginCards = (p) => {
    const ruFormat = (a) => {
        if(a >= 0) return new Intl.NumberFormat('ru-RU').format(a.toFixed(2)) + ' ₽';
        return ''
    }
    let a = <div>
        <Cell disabled after={ruFormat(p.u.rubValueAvailable)}>
            Доступно средств
        </Cell>
        <Cell disabled after={ruFormat(p.u.rubValueNaked)}>
            Непокрытые позиции
        </Cell>
        <Cell disabled after={'1:'+p.u.leverage}>
            Кредитное плечо
        </Cell>
    </div>
    if(!p.e){
        a = ''
    }
    if(!p.u){
        p.u.commission = 0
    }
    return <Group header={<Header mode={'secondary'}>Маржинальная торговля</Header>}>
        <CardGrid size={"l"}>
            <Card>
                <List>
                    <Cell disabled after={<Switch checked={p.e} onChange={p.m}/>}>
                        Торговля с плечом
                    </Cell>
                    <Cell disabled after={p.u.commission * 100+'%'}>
                        Коммиссия за сделки
                    </Cell>
                    {a}
                </List>
            </Card>
        </CardGrid>
    </Group>
}

export default MarginCards;