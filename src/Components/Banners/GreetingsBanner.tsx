import {Avatar, Banner, Button} from "@vkontakte/vkui";
import {Icon24ExternalLinkOutline, Icon28HorseToyOutline} from "@vkontakte/icons";
import fs from "../../Functions/Firebase";

interface props {
    show: boolean,
    vkuid: number,
    open: () => void
}

const GreetingsBanner = ({show, vkuid, open}: props) => {
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
            subheader={'Получите ответы на часто задаваемые вопросы'}
            actions={<Button
                onClick={open}
                before={<Icon24ExternalLinkOutline/>}
            >
                Открыть</Button>}
        />
    }
    return ''
}

export default GreetingsBanner