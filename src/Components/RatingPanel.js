import React from "react";
import {
    Avatar, Caption,
    Card,
    CardGrid,
    CardScroll, Cell,
    HorizontalCell,
    List, Placeholder, Separator,
    Spinner, Title
} from "@vkontakte/vkui";
import fs from "../Functions/Firebase";
import bridge from "@vkontakte/vk-bridge";
import {Icon28Ghost} from "@vkontakte/icons";

class RatingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rates: {}, activeTier: this.props.tier, position: 0, users: []}
        this.tiers = [
            {
                name: 'Бронзовый',
                id: 'bronze',
                color: '#cd7f32'
            },
            {
                name: 'Серебрянный',
                id: 'silver',
                color: '#c0c0c0'
            },
            {
                name: 'Золотой',
                id: 'gold',
                color: '#FFD700'
            },
            {
                name: 'Сапфировый',
                id: 'sapphire',
                color: '#0f52ba'
            },
            {
                name: 'Рубиновый',
                id: 'ruby',
                color: '#E0115F'
            },
            {
                name: 'Аметистовый',
                id: 'amethyst',
                color: '#9966cc'
            }
        ]
    }
    componentDidMount() {
        this.listener = fs.collection('users').doc('-3').onSnapshot(async e => {
            let a = [];
            for(const v of Object.keys(e.data())){
                for(const k of e.data()[v]){
                    a.push(k.id)
                }
            }
            let b;
            if(this.props.token){
                b = await bridge.send("VKWebAppCallAPIMethod",
                    {
                        "method": "users.get",
                        "request_id": new Date().getTime(),
                        "params": {"user_ids": a.join(','), "v":"5.131", "access_token":this.props.token, "fields": "photo_200"}
                    });
            }
            else{
                b = {
                    response: []
                }
            }
            for(let i = 0; i < a.length; i++) {
                b.response.push({
                    photo_200: 'https://vk.com/images/deactivated_200.png',
                    first_name: 'Александр',
                    last_name: 'Сиротин',
                    id: a[i]
                })
            }
            this.setState({rates: e.data(), users: await b.response, activeTier: this.props.tier})
        })
    }
    componentWillUnmount() {
        this.listener();
    }

    ruFormat(a){
        if(a) return new Intl.NumberFormat('ru-RU').format(a.toFixed(2));
        return 0
    }
    render() {
        let a = this.tiers.find(x => x.id === this.props.tier)
        let b = this.tiers.find(x => x.id === this.state.activeTier)
        if(typeof(a) === 'undefined' || typeof(b) === 'undefined'){
            return <Spinner/>
        }
        return <CardGrid style={{marginTop: 12}} size={"l"}>
            <Card style={{paddingTop: 20, paddingBottom: 20}}>
                <CardScroll>
                    {this.tiers.map(v =>
                    {
                        let style = {background: v.color};
                        let isActive = this.props.tier === v.id;
                        if(isActive) style.transform = 'scale(1.1)'
                        return <HorizontalCell onClick={() => {this.setState({activeTier: v.id})}} key={v.id}>
                            <Avatar style={style}/>
                        </HorizontalCell>
                    })}
                </CardScroll>
                <Title style={{textAlign: 'center'}} weight={'bold'} level={1}>{a.name} разряд</Title>
                {this.state.activeTier !== this.props.tier ? <Title
                    weight={'regular'}
                    level={3}
                    style={{textAlign: 'center', marginTop: 8}}
                >Просматривается: {b.name}</Title> : ''}
            </Card>
            <Card style={{paddingTop: 10, paddingBottom: 10, marginBottom: 10}}>
                <List>
                    {this.state.rates[this.state.activeTier] ?
                        (this.state.rates[this.state.activeTier].length > 0 ?
                        this.state.rates[this.state.activeTier].map((k, i) => {
                        let ud = this.state.users.find(x => x.id === k.id);
                        let a, b;
                        if(i === 5){
                            a = <div>
                                <Caption style={{color: 'var(--dynamic_green)', textAlign: 'center'}} weight={'regular'} level={1}>
                                    Переходят в следующий разряд
                                </Caption>
                                <Separator style={{marginTop: 4, height: 3, background: 'var(--dynamic_green)'}}/>
                            </div>
                        }
                        if(i === this.state.rates[this.state.activeTier].length - 5){
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
                                  style={k.id === Number(this.props.vkuid) ? {background: 'var(--background_text_highlighted)'} : {}}
                                  onClick={() => {
                                      this.props.openProfile('profile', {observerProfile: ud.id, observerGain: k.gainPercents, observerRating: i+1})
                                      bridge.send('VKWebAppTapticImpactOccurred', {style: 'light'})
                                  }}
                                  description={(i+1)+' место'}
                                  before={ud ? <Avatar src={ud.photo_200}/> : <Spinner/>}
                                  after={<div style={{textAlign: "right"}}>
                                      <Title
                                          style={{color: 'var(--header_text)'}}
                                          level={3}
                                          weight={"medium"}>
                                          {this.ruFormat(k.val)+' ₽'}
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
                                          {this.ruFormat(k.gain) + ' ₽ (' + this.ruFormat(k.gainPercents)+ ' %)'}
                                      </Caption>
                                  </div>}>
                                {ud ? `${ud.first_name} ${ud.last_name.substr(0, 1)}.` : ''}
                            </Cell>
                        </div>
                    }) :
                    <Placeholder icon={<Icon28Ghost fill={this.tiers.find(z => z.id === this.state.activeTier).color} width={56} height={56}/>} header={'Здесб сейчас пусто'}/>
                    ) : <Spinner/>
                    }
                </List>
            </Card>
        </CardGrid>
    }
}

export default RatingPanel;