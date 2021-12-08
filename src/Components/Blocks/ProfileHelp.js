import {Cell, Group, Header} from "@vkontakte/vkui";

const ProfileHelp = ({updateView}) => {
    return <Group header={<Header mode={'secondary'}>Помощь</Header>}>
        <Cell onClick={() => updateView('questions')}>Частые вопросы</Cell>
    </Group>
}

export default ProfileHelp