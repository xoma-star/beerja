import React from "react";
import {
    PanelHeader,
    PanelHeaderBack,
    Spinner
} from "@vkontakte/vkui";
import fs from "../../Functions/Firebase";
import bridge from "@vkontakte/vk-bridge";
import ProfileCards from "../Blocks/ProfileCards";
import ProfileHeader from "../Blocks/ProfileHeader";
import ProfilePrivatePlaceholder from "../Blocks/ProfilePrivatePlaceholder";
import ProfileSettings from "../Blocks/ProfileSettings";
import ProfilePortfolio from "../Blocks/ProfilePortfolio";
import ProfileHelp from "../Blocks/ProfileHelp";

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
            <ProfileHeader userData={this.state.userData}/>
            {this.props.isObserver ?
                (!this.state.firestore.publicProfile ?
                    <ProfilePrivatePlaceholder/> :
                    <ProfileCards
                        gain={this.props.observerGain}
                        deals={this.state.firestore.deals.length}
                        place={this.props.observerPlace}
                    />
                )
                : ''
            }
            {!this.props.isObserver ?
                <div>
                    <ProfileSettings
                        isRating={this.props.settings.isRatingParticipant}
                        isPublic={this.props.settings.publicProfile}
                        updateSetting={(k, v) => this.updateSetting(k, v)}
                    />
                    <ProfileHelp
                        updatePanel={this.props.updatePanel}
                        updateView={this.props.updateView}
                    />
                </div>
                :
                    (this.state.firestore.publicProfile ?
                        <ProfilePortfolio portfolio={this.state.firestore.portfolio} commodities={this.state.firestore.commodities}/>
                        : ''
                    )
            }
        </div>
    }
}

export default ProfilePanel