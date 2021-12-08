import {Caption, Card} from "@vkontakte/vkui";
import React from "react";

const RatingCaptions = () => {
    return <Card style={{paddingTop: 20, paddingBottom: 20, color: 'var(--header_text_secondary)', marginBottom: 10}}>
        <Caption weight={'regular'} level={2} style={{textAlign: 'center'}}>
            Списки обновляются каждое воскресенье.
        </Caption>
        <Caption weight={'regular'} level={2} style={{textAlign: 'center'}}>
            5 лучших переходят в разряд выше, 5 худших - ниже
        </Caption>
        <Caption weight={'regular'} level={2} style={{textAlign: 'center'}}>
            Чем выше разряд - тем выше награды
        </Caption>
    </Card>
}

export default RatingCaptions