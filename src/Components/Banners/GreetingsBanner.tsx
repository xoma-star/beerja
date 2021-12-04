import {Avatar, Banner, Button} from "@vkontakte/vkui";
import {Icon24ExternalLinkOutline, Icon28HorseToyOutline} from "@vkontakte/icons";
import fs from "../../Functions/Firebase";

interface props {
    show: boolean,
    vkuid: number
}

const GreetingsBanner = ({show, vkuid}: props) => {
    const gradient = {
        background: 'linear-gradient(45deg, #ff6e7f, #bfe9ff)'
    }
    if(show){
        return <Banner
            onDismiss={async () => {
                    await fs.collection('users').doc(vkuid.toString()).update({
                        isNewUser: false
                    })
                }
            }
            asideMode={'dismiss'}
            header={'Нужна помощь?'}
            before={<Avatar style={gradient} size={64}><Icon28HorseToyOutline fill={'#fff'} width={40} height={40}/></Avatar>}
            subheader={'Получите ответ, задав вопрос в сообщениях сообщества'}
            actions={<Button
                onClick={() => window.open('https://vk.me/public207277087', '_blank')}
                before={<Icon24ExternalLinkOutline/>}
            >
                Написать</Button>}
        />
    }
    return ''
}

export default GreetingsBanner