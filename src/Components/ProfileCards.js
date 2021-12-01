import {Avatar, Caption, Card, CardGrid, Group, Title} from "@vkontakte/vkui";
import {
    Icon24CupOutline,
    Icon28CalendarOutline,
    Icon28GraphOutline,
} from "@vkontakte/icons";
import React from "react";

const ProfileCards = (p) => {
    const ruFormat = (a) => {
        if(a) return new Intl.NumberFormat('ru-RU').format(a.toFixed(2));
        return 0
    }
    const button = (icon, caption, value, isColor) => {
        return <Card
            mode={'shadow'}
            style={{paddingTop: 14, paddingBottom: 14, textAlign: 'center'}}
        >
            <Avatar style={{background: 'var(--control_foreground)', display: 'inline-block', marginTop: 6}}>
                {icon}
            </Avatar>
            <Title style={
                !isColor ? {color: 'var(--text_primary)'} :
                    parseFloat(value) !== 0 ?
                        (parseFloat(value) > 0 ?
                                {color: 'var(--dynamic_green)'} :
                                {color: 'var(--dynamic_red)'}
                        ) : {color: 'var(--dynamic_gray)'}
            } weight={'semibold'} level={3}>{value}</Title>
            <Caption style={{color: 'var(--content_placeholder_text)'}} weight={'regular'} level={1}>{caption}</Caption>
        </Card>
    }
    return <Group>
        <CardGrid size="s" style={{textAlign: 'center', color: 'var(--accent_alternate)'}}>
            {button(<Icon28CalendarOutline fill={'var(--background_content)'}/>, 'сделок за месяц', p.deals, false)}
            {button(<Icon24CupOutline width={28} height={28} fill={'var(--background_content)'}/>, 'место в разряде', p.place, false)}
            {button(<Icon28GraphOutline fill={'var(--background_content)'}/>, 'доход за неделю', `${ruFormat(p.gain)} %`, true)}
        </CardGrid>
    </Group>
}

export default ProfileCards;