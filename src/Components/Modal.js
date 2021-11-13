import {
    Div,
    Button,
    Group,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    SliderSwitch,
    FormLayout,
    FormItem, Input, IconButton, Header, Title, PanelHeaderClose, PanelHeaderBack
} from "@vkontakte/vkui";
import {useState} from "react";
import {Icon24Add, Icon24Cancel} from "@vkontakte/icons";

const Modal = (p) => {
    const [type, setType] = useState(null);
    const [input, updateInput] = useState(0);
    //p.b = 10000;
    const formatInput = (t) => {
        t = t.replace(/[^0-9]/g, '');
        if(t.charAt(0) === '0' && t > 0){
            t = t.substr(1);
        }
        if(t.length === 0){
            t = 0;
        }
        return t;
    }
    const closeModal = () => {
        p.s(null, null);
        setTimeout(() => {
            setType(null);
            updateInput(0);
        }, 250);
    }
    return <ModalRoot activeModal={p.v} onClose={closeModal}>
        <ModalPage
            id={"stock"}
            header={<ModalPageHeader left={<PanelHeaderBack onClick={closeModal}/>}><Header>{p.t}</Header></ModalPageHeader>}
            dynamicContentHeight
        >
            <FormLayout>
                {type === null ?
                    <FormItem style={{display: 'flex'}}>
                        <Button onClick={() => {setType('buy')}} mode={"commerce"} stretched size={"l"}>Купить</Button>
                        <div style={{width: 10}}/>
                        <Button onClick={() => {setType('sell')}} mode={"destructive"} stretched size={"l"}>Продать</Button>
                    </FormItem>
                    :
                    <div>
                        <FormItem>
                            <Title level={1} weight={'bold'}>{type === 'buy' ? 'Покупка' : 'Продажа'}</Title>
                        </FormItem>
                        <FormItem>
                            <Input disabled value={123}/>
                        </FormItem>
                        <FormItem>
                            <Title level={1} weight={'bold'}>Количество</Title>
                        </FormItem>
                        <FormItem bottom={'доступно 2'}>
                            <Input after={
                                <div style={{display: 'flex'}}>
                                    <IconButton icon={<Icon24Add/>}/>
                                    <IconButton icon={<Icon24Cancel/>}/>
                                </div>
                            }
                                   onChange={(e) => updateInput(formatInput(e.target.value))}
                                   value={input}
                            />
                        </FormItem>
                        <FormItem>
                            <Button size={"l"} stretched>{type === 'buy' ? 'Купить' : 'Продать'}</Button>
                        </FormItem>
                    </div>
                }
            </FormLayout>
        </ModalPage>
    </ModalRoot>
}

export default Modal;