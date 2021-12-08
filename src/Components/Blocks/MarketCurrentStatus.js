import {Avatar, Cell, Title} from "@vkontakte/vkui";
import React from "react";

const MarketCurrentStatus = ({nameClass, color, description, isDayOff, isDaySpecial}) => {
    return <Cell disabled before={
        <Avatar className={'pulse '+nameClass} size={18}>
            {/*<Avatar size={8} style={{background: states[p.m].colors.element}}/>*/}
        </Avatar>
    }>
        <Title weight={'semibold'} level={3} style={{color: color}}>
            {`${description} ${isDayOff ? (isDaySpecial ? ' ('+isDaySpecial+')' : ' (выходной)') : ''}`}
        </Title>
    </Cell>
}

export default MarketCurrentStatus