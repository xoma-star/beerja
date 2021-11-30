import React from "react";
import {
    Avatar, CardScroll,
    Cell,
    Gradient,
    Group,
    Header,
    PanelHeader,
    PanelHeaderBack,
    Placeholder, Spinner,
    Switch,
    Title
} from "@vkontakte/vkui";
import fs from "../Functions/Firebase";
import bridge from "@vkontakte/vk-bridge";
import {Icon28IncognitoOutline, Icon56LockOutline} from "@vkontakte/icons";
import StockCardHorizontal from "./StockCardHorizontal";
import ProfileCards from "../ProfileCards";

class ProfilePanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            firestore: {}
        }
    }
    async componentDidMount() {
        let b;
        if(this.props.token){
            b = (await bridge.send("VKWebAppCallAPIMethod",
                {
                    "method": "users.get",
                    "request_id": new Date().getTime(),
                    "params": {"user_ids": this.props.vkuid, "v":"5.131", "access_token":this.props.token, "fields": "photo_200"}
                })).response[0];
        }
        else{
            b = {
                photo_200: 'https://vk.com/images/deactivated_200.png',
                first_name: 'Александр',
                last_name: 'Сиротин',
                id: this.props.vkuid
            }
        }
        this.setState({userData: b})
        await fs.collection('users').doc(this.props.vkuid.toString()).get().then(v => {
            this.setState({firestore: v.data()})
        })
    }
    async updateSetting(key, value){
        let newSets = {}
        newSets[key] = value;
        await fs.collection('users').doc(this.props.vkuid.toString()).update(newSets)
    }
    render() {
        if(!this.state.firestore.balance){
            return <Spinner/>
        }
        return <div>
            {this.props.isObserver ?
                <PanelHeader left={<PanelHeaderBack onClick={this.props.back}/>}>Просмотр профиля</PanelHeader>
                : ''}
            <Gradient style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 32,

                }
            }>
                <Avatar size={96} style={{marginBottom: 10}} src={this.state.userData.photo_200}/>
                <Title weight={'semibold'} level={1}>{this.state.userData.last_name ? `${this.state.userData.first_name} ${this.state.userData.last_name.substr(0, 1)}.` : ''}</Title>
            </Gradient>
            {this.props.isObserver ? (!this.state.firestore.publicProfile ? <Placeholder
                icon={<Icon56LockOutline/>}
                header={'Закрытый профиль'}>Пользователь предпочел скрыть статистику</Placeholder> :
                <ProfileCards gain={this.props.observerGain} deals={this.state.firestore.deals.length} place={this.props.observerPlace}/>) : ''
            }
            {!this.props.isObserver ? <Group header={<Header mode={'secondary'}>настройки</Header>}>
                <Cell
                    disabled
                    after={<Switch
                        checked={this.props.settings.isRatingParticipant}
                        onChange={() => this.updateSetting('clearing', !this.props.settings.isRatingParticipant)}
                    />}>
                    Участвовать в рейтинге
                </Cell>
                <Cell
                    disabled
                    after={<Switch
                        checked={this.props.settings.publicProfile}
                        onChange={() => this.updateSetting('publicProfile', !this.props.settings.publicProfile)}
                    />}>
                    Публичная статистика
                </Cell>
            </Group> : (this.state.firestore.publicProfile ? <div>
                <Group header={<Header mode={'secondary'}>Акции</Header>}>

                        {this.state.firestore.portfolio.length > 0 ?
                            <CardScroll>
                                {this.state.firestore.portfolio.map(v => <StockCardHorizontal key={'hor'+v.ticker} v={v.ticker}/>)}
                            </CardScroll>
                            :
                            <Placeholder icon={<Icon28IncognitoOutline width={56} height={56}/>}>У пользователя нет акций</Placeholder>
                        }
                </Group>
                    {Object.keys(this.state.firestore.commodities).length > 0 ? <Group header={<Header mode={'secondary'}>Товары</Header>}><CardScroll>
                        {Object.keys(this.state.firestore.commodities).map(v =>
                            <StockCardHorizontal key={'hor'+v}
                                                 v={'#'+v}/>)}
                    </CardScroll></Group>: ''}
            </div> : '')}
        </div>
    }
}

export default ProfilePanel