import {Card, CardGrid, Group, Header, Title} from "@vkontakte/vkui";
import {
    Icon28GiftOutline, Icon28GraphOutline,
    Icon28MoneyHistoryBackwardOutline,
    Icon28StopwatchOutline
} from "@vkontakte/icons";
import React from "react";
import bridge from "@vkontakte/vk-bridge";

const OperationCards = (p) => {
    return <Group header={<Header mode={'secondary'}>Операции</Header>}>
        <CardGrid size="s" style={{textAlign: 'center', color: 'var(--accent_alternate)'}}>
            <Card
                style={{paddingTop: 14, paddingBottom: 14, textAlign: 'center'}}
                onClick={async () => {p.od(); await bridge.send("VKWebAppTapticImpactOccurred", {"style": "light"});}}
            >
                <Title weight={'semibold'} level={3}>
                    История
                </Title>
                <Icon28MoneyHistoryBackwardOutline style={{display: 'inline-block', marginTop: 6}}/>
            </Card>
            <Card
                onClick={async () =>
                    {
                        p.tdb();
                        await bridge.send("VKWebAppTapticImpactOccurred", {"style": "light"});
                    }
                }
                style={{paddingTop: 14, paddingBottom: 14, textAlign: 'center'}}>
                <Title weight={'semibold'} level={3}>
                    Бонус
                </Title>
                {p.l ? <Icon28StopwatchOutline style={{display: 'inline-block', marginTop: 6}}/> : <Icon28GiftOutline style={{display: 'inline-block', marginTop: 6}}/>}
            </Card>
            <Card
                style={{paddingTop: 14, paddingBottom: 14, textAlign: 'center'}}
                onClick={async () =>
                    {
                        p.oa();
                        await bridge.send("VKWebAppTapticImpactOccurred", {"style": "light"});
                    }
                }
            >
                <Title weight={'semibold'} level={3}>
                    Аналитика
                </Title>
                <Icon28GraphOutline style={{display: 'inline-block', marginTop: 6}}/>
            </Card>
        </CardGrid>
    </Group>
}

export default OperationCards;