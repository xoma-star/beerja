import {Card, CardGrid, Cell, Group, Header, List, Switch} from "@vkontakte/vkui";
import React from "react";
import RuFormat from "../../Functions/RuFormat";

interface props {
    userValue: {
        rubValueAvailable: number,
        rubValueNaked: number,
        dailyCharge: number,
        leverage: number,
        commission: number
    },
    margeStatus: boolean,
    updateStatus: () => void
}

const MarginCards = ({userValue, margeStatus, updateStatus}: props) => {
    if(!userValue.commission){
        return ''
    }
    return <Group header={<Header mode={'secondary'}>Маржинальная торговля</Header>}>
        <CardGrid size={"l"}>
            <Card>
                <List>
                    <Cell disabled after={<Switch checked={margeStatus} onChange={updateStatus}/>}>Торговля с плечом</Cell>
                    <Cell disabled after={userValue.commission * 100 + '%'}>Коммиссия за сделки</Cell>
                    <div style={!margeStatus ? {display: 'none'} : {}}>
                        <Cell disabled after={RuFormat(userValue.rubValueAvailable)+' ₽'}>Доступно средств</Cell>
                        <Cell disabled after={RuFormat(userValue.rubValueNaked)+' ₽'}>Непокрытые позиции</Cell>
                        <Cell disabled after={RuFormat(userValue.dailyCharge)+' ₽'}>Обслуживание в сутки</Cell>
                        <Cell disabled after={'1:'+userValue.leverage.toString()}>Кредитное плечо</Cell>
                    </div>
                </List>
            </Card>
        </CardGrid>
    </Group>
}

export default MarginCards;