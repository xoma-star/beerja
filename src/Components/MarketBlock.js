import {Avatar, Caption, Cell, Group, List, Progress, Title} from "@vkontakte/vkui";
import React from "react";
import MarketSections from "../Functions/MarketSections";

const MarketBlock = (p) => {
    const states = {
        close1: {
            description: 'Биржа закрыта',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            },
            className: 'close'
        },
        pre: {
            description: 'Предторговый период',
            colors: {
                background: '#ffa0007F',
                element: 'var(--dynamic_orange)'
            },
            className: 'pre'
        },
        open: {
            description: 'Рынок открыт',
            colors: {
                background: '#4bb34b80',
                element: 'var(--dynamic_green)'
            },
            className: 'open'
        },
        post: {
            description: 'Послеторговый период',
            colors: {
                background: '#5c9ce69e',
                element: 'var(--blue_200)'
            },
            className: 'post'
        },
        close2: {
            description: 'Биржа закрыта',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            },
            className: 'close'
        },
    }
    let a = MarketSections();
    let values = a.progress;
    return <Group className={a.isDayOff ? 'paddingBottom0' : ''}>
        <Cell disabled before={
            <Avatar className={'pulse '+states[p.m].className} size={18}>
                {/*<Avatar size={8} style={{background: states[p.m].colors.element}}/>*/}
            </Avatar>
        }>
            <Title weight={'semibold'} level={3} style={{color: states[p.m].colors.element}}>
                {`${states[p.m].description} ${a.isDayOff ? ' (выходной)' : ''}`}
            </Title>
        </Cell>
        <div style={a.isDayOff ? {display: 'none'} : {}}>
            <div style={{display: 'flex', padding: 8}}>
                <Progress className={'marketProgress marketProgressClose'} value={values.close1} style={{width: '20%'}}/>
                <Progress className={'marketProgress marketProgressPre'} value={values.pre} style={{width: '20%'}}/>
                <Progress className={'marketProgress marketProgressOpen'} value={values.open} style={{width: '20%'}}/>
                <Progress className={'marketProgress marketProgressPost'} value={values.post} style={{width: '20%'}}/>
                <Progress className={'marketProgress marketProgressClose'} value={values.close2} style={{width: '20%', marginRight: 0}}/>
            </div>
            <List style={{marginBottom: 12}}>
                {Object.keys(states).map(v => {
                    if(v === 'close2'){
                        return ''
                    }
                    return <Cell disabled key={v+'dd'} style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states[v].colors.element}} size={8}/>}>
                        <Caption weight={'regular'} level={1}>{states[v].description}</Caption>
                    </Cell>
                })}
            </List>
        </div>
    </Group>
}

export default MarketBlock;