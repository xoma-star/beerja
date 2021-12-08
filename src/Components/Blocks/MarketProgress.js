import {Caption, Progress} from "@vkontakte/vkui";
import React from "react";

const MarketProgress = ({values, start, end}) => {
    return <div>
        <div style={{display: 'flex', padding: 8}}>
            <Progress className={'marketProgress marketProgressClose'} value={values.close1} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressPre'} value={values.pre} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressOpen'} value={values.open} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressPost'} value={values.post} style={{width: '20%'}}/>
            <Progress className={'marketProgress marketProgressClose'} value={values.close2} style={{width: '20%', marginRight: 0}}/>
        </div>
        <div style={{display: 'flex', color: 'var(--activity_indicator_tint)'}}>
            <Caption style={{left: '17%', position: 'relative'}} weight={'regular'} level={3}>
                {`${start.hours}:${start.minutes}`}
            </Caption>
            <Caption style={{left: '68%', position: 'relative'}} weight={'regular'} level={3}>
                {`${end.hours}:${end.minutes}`}
            </Caption>
        </div>
        <Caption
            weight={'regular'}
            level={1}
            style={{textAlign: 'center', color: 'var(--activity_indicator_tint)'}}
        >
            Часовой пояс биржи: Нью-Йорк (UTC -5)
        </Caption>
    </div>
}

export default MarketProgress