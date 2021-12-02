import {Avatar, Banner, Button} from "@vkontakte/vkui";
import {Icon24ExternalLinkOutline, Icon28HorseToyOutline} from "@vkontakte/icons";
import fs from "../Functions/Firebase";

const GreetingsBanner = (p) => {
    const gradient = {
        background: 'linear-gradient(45deg, #ff6e7f, #bfe9ff)'
}
    if(p.show){
        return <Banner
            onDismiss={async () => {
                    await fs.collection('users').doc(p.vkuid.toString()).update({
                        isNewUser: false
                    })
                }
            }
            asideMode={'dismiss'}
            header={'Впервые здесь?'}
            before={<Avatar style={gradient} size={64}><Icon28HorseToyOutline fill={'#fff'} width={40} height={40}/></Avatar>}
            subheader={'Небольшая статья, которая поможет освоиться'}
            actions={<Button
                onClick={() => window.open('https://google.com/search', '_blank')}
                before={<Icon24ExternalLinkOutline/>}
            >
                Открыть</Button>}
        />
    }
    return ''
}

export default GreetingsBanner