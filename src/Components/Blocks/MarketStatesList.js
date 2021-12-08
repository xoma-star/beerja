import {Avatar, Caption, Cell, List} from "@vkontakte/vkui";
import React from "react";

const MarketStatesList = ({states}) => {
    return <List style={{marginBottom: 12}}>
        {Object.keys(states).map(v => {
            if(v === 'close2'){
                return ''
            }
            return <Cell disabled key={v+'dd'} style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states[v].colors.element.toString()}} size={8}/>}>
                <Caption weight="regular" level="1">{states[v].description}</Caption>
            </Cell>
        })}
    </List>
}

export default MarketStatesList