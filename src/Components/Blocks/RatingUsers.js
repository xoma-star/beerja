import {Avatar, Caption, Card, Cell, List, Placeholder, Separator, Spinner, Title} from "@vkontakte/vkui";
import {Icon28Ghost} from "@vkontakte/icons";
import React from "react";
import RuFormat from "../../Functions/RuFormat";

const RatingUsers = ({rates, activeTier, users, vk_user_id, openProfile}) => {
    return <Card style={{paddingTop: 10, paddingBottom: 10}}>
        <List>
            {rates[activeTier] ?
                (rates[activeTier].length > 0 ?
                        rates[activeTier].map((k, i) => {
                            let ud = users.find(x => x.id === k.id);
                            let a, b;
                            if(i === 5 || i === rates[activeTier].length){
                                a = <div>
                                    <Caption style={{color: 'var(--dynamic_green)', textAlign: 'center'}} weight={'regular'} level={1}>
                                        Переходят в следующий разряд
                                    </Caption>
                                    <Separator style={{marginTop: 4, height: 3, background: 'var(--dynamic_green)'}}/>
                                </div>
                            }
                            if(i === rates[activeTier].length - 5 && rates[activeTier].length > 5 && activeTier !== 'bronze'){
                                b = <div>
                                    <Separator style={{marginBottom: 4, height: 3, background: 'var(--dynamic_red)'}}/>
                                    <Caption style={{color: 'var(--dynamic_red)', textAlign: 'center'}} weight={'regular'} level={1}>
                                        Переходят в предыдущий разряд
                                    </Caption>
                                </div>
                            }
                            return <div key={k.id}>
                                {a}
                                {b}
                                <Cell
                                    style={k.id === Number(vk_user_id) ?
                                        {background: 'linear-gradient(16deg, #2d81e038, #ffffff00)'} :
                                        {}}
                                    onClick={() => {
                                        openProfile('profile', {observerProfile: ud.id, observerGain: k.gainPercents, observerRating: i+1})
                                    }}
                                    description={(i+1)+' место'}
                                    before={ud ? <Avatar src={ud.photo_200}/> : <Spinner/>}
                                    after={<div style={{textAlign: "right"}}>
                                        <Title
                                            style={{color: 'var(--header_text)'}}
                                            level="3"
                                            weight="medium">
                                            {RuFormat(k.val)+' ₽'}
                                        </Title>
                                        <Caption
                                            weight={'regular'}
                                            level={2}
                                            style={
                                                k.gain !== 0 ? (
                                                    k.gain > 0 ?
                                                        {color: 'var(--dynamic_green)'} :
                                                        {color: 'var(--dynamic_red)'}
                                                ) : {color: 'var(--dynamic_gray)'}
                                            }
                                        >
                                            {RuFormat(k.gain) + ' ₽ (' + RuFormat(k.gainPercents)+ ' %)'}
                                        </Caption>
                                    </div>}>
                                    {ud ? `${ud.first_name} ${ud.last_name.substr(0, 1)}.` : ''}
                                </Cell>
                            </div>
                        }) :
                        <Placeholder icon={<Icon28Ghost width={56} height={56}/>} header={'Здесб сейчас пусто'}/>
                ) : <Spinner/>
            }
        </List>
    </Card>
}
export default RatingUsers