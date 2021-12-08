import {Avatar, Card, CardScroll, HorizontalCell, Title} from "@vkontakte/vkui";
import React from "react";
import Tiers from "../../Functions/Tiers";

const RatingBubbles = ({userTier, activeTier, parentStateUpdate}) => {
    return <Card style={{paddingTop: 10, paddingBottom: 10}}>
        <Title style={{textAlign: 'left', marginBottom: 8, marginLeft: 24}} weight={'bold'} level={1}>{userTier.name} разряд</Title>
        <CardScroll>
            {Tiers.map(v =>
            {
                let style = {};
                let isActive = userTier.id === v.id;
                return <HorizontalCell style={{marginTop: 4}} onClick={() => {parentStateUpdate({activeTier: v.id})}} key={v.id}>
                    <Avatar style={style} className={'ratingBubble ' + v.id + (isActive ? ' active' : '')}/>
                </HorizontalCell>
            })}
        </CardScroll>
        {activeTier !== userTier ? <Title
            weight={'regular'}
            level={3}
            style={{textAlign: 'center'}}
        >Просматривается: {activeTier.name}</Title> : ''}
    </Card>
}
export default RatingBubbles