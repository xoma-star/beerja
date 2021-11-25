import {Cell, Group, Header} from "@vkontakte/vkui";

const ErrorBlock = (p) => {
    if(p.e.length === 0){
        return ''
    }
    const captions = {
        406: 'Ошибка Alpaca WS. Цены на акции не обновляются в реальном времени. Возможно приложение открыто с нескольких устройств. Цены обновляются только на первом.',
        404: 'Ошибка Alpaca: время авторизации превышено'
    }
    return <Group description={'Вообще ошибок быть не должно. Но если что-то работает неправильно, вы узнаете об этом здесь'} header={<Header mode={'secondary'}>Ошибки</Header>}>
        {p.e.map(v =>
            <Cell multiline key={v}>
                {captions[v]}
            </Cell>
        )}
    </Group>
}

export default ErrorBlock