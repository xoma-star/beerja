import {Avatar, Cell, Group, List, Progress, Title} from "@vkontakte/vkui";
import React from "react";
import MarketSections from "../Functions/MarketSections";

const MarketBlock = (p) => {
    const states = {
        pre: {
            description: 'Предторговый период',
            colors: {
                background: '#ffa0007F',
                element: 'var(--dynamic_orange)'
            }
        },
        open: {
            description: 'Рынок открыт',
            colors: {
                background: '#4bb34b80',
                element: 'var(--dynamic_green)'
            }
        },
        post: {
            description: 'Послеторговый период',
            colors: {
                background: '#5c9ce69e',
                element: 'var(--blue_200)'
            }
        },
        close1: {
            description: 'Рынок закрыт',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            }
        },
        close2: {
            description: 'Рынок закрыт',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            }
        },
    }
    let values = MarketSections().progress;
    return <Group>
        <Cell before={
            <Avatar size={18} style={{background: states[p.m].colors.background}}>
                <Avatar size={8} style={{background: states[p.m].colors.element}}/>
            </Avatar>
        }>
            <Title weight={'semibold'} level={3} style={{color: states[p.m].colors.element}}>
                {states[p.m].description}
            </Title>
        </Cell>
        <div style={{display: 'flex', padding: 8}}>
            <Progress className={'marketProgress marketProgressClose'} value={values.close1} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressPre'} value={values.pre} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressOpen'} value={values.open} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressPost'} value={values.post} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressClose'} value={values.close2} style={{width: '20%', marginRight: 0}}/>
        </div>
        <List style={{marginBottom: 12}}>
            <Cell style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states.close1.colors.element}} size={8}/>} description={states.close1.description}/>
            <Cell style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states.pre.colors.element}} size={8}/>} description={states.pre.description}/>
            <Cell style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states.open.colors.element}} size={8}/>} description={states.open.description}/>
            <Cell style={{minHeight: 0, height: 20}} before={<Avatar style={{background: states.post.colors.element}} size={8}/>} description={states.post.description}/>
        </List>
    </Group>
}

export default MarketBlock;