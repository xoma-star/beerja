import {Avatar, Headline, Cell, Group, Progress, Spinner} from "@vkontakte/vkui";
import React from "react";
import RuFormat from "../../Functions/RuFormat";

const AnalyticsBlock = (p) => {
    if(Object.keys(p.v).length < 1) return <Spinner/>
    let total = p.v.values.stocks + p.v.values.currencies + p.v.values.commodities;
    let s = {
        cur: {
            color: 'var(--dynamic_orange)',
            description: 'Валюта',
            val: p.v.values.currencies / total * 100,
            className: 'marketProgressPre',
            abs: p.v.values.currencies
        },
        sto: {
            color: 'var(--dynamic_green)',
            description: 'Акции',
            val: p.v.values.stocks / total * 100,
            className: 'marketProgressOpen',
            abs: p.v.values.stocks
        },
        com: {
            color: 'var(--blue_200)',
            description: 'Товары',
            val: p.v.values.commodities / total * 100,
            className: 'marketProgressPost',
            abs: p.v.values.commodities
        }
    }

    return <Group style={{paddingBottom: 12}}>
        <div style={{display: 'flex', paddingLeft: 8}}>
            {Object.keys(s).map(k =>
                <Progress key={k+'dad'} className={'marketProgress '+s[k].className} style={{width: s[k].val + '%'}} value={100} />
            )}
        </div>
        {Object.keys(s).map(k =>
            <Cell
                disabled
                key={k+'ded'}
                style={{minHeight: 0, height: 24}}
                before={<Avatar style={{background: s[k].color}} size={12}/>}
                after={RuFormat(s[k].abs) + ' ₽'}
            >
                <Headline weight={'regular'} level={1}>{s[k].description}</Headline>
            </Cell>
        )}
        <Cell
            disabled
            style={{minHeight: 0, height: 24}}
            before={<Avatar style={{background: 'var(--dynamic_red)'}} size={12}/>}
            after={RuFormat(total) + ' ₽'}
        >
            <Headline weight={'semibold'} level={1}>Всего</Headline>
        </Cell>
    </Group>
}

export default AnalyticsBlock;