import React from "react";
import {
    CardGrid,
    Spinner
} from "@vkontakte/vkui";
import fs from "../../Functions/Firebase";
import bridge from "@vkontakte/vk-bridge";
import '../stylesheets/RatingBubbles.css'
import RatingCaptions from "../Blocks/RatingCaptions";
import RatingBubbles from "../Blocks/RatingBubbles";
import Tiers from "../../Functions/Tiers";
import RatingUsers from "../Blocks/RatingUsers";

class RatingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rates: {}, activeTier: this.props.tier, position: 0, users: []}
        this.tiers = Tiers
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
            <RatingBubbles parentStateUpdate={(v) => {this.setState(v)}} userTier={a} activeTier={b}/>
            <RatingUsers rates={this.state.rates} activeTier={this.state.activeTier} users={this.state.users} vk_user_id={this.props.vkuid} openProfile={this.props.openProfile}/>
            <RatingCaptions/>
        </CardGrid>
    }
}

export default RatingPanel;