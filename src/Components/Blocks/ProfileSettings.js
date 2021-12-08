import {Cell, Group, Header, Separator, Switch} from "@vkontakte/vkui";
import React from "react";

const ProfileSettings = ({isPublic, isRating, updateSetting}) => {
    return <div>
        <Group header={<Header mode={'secondary'}>настройки</Header>}>
            <Cell
                disabled
                after={<Switch
                    checked={isRating}
                    onChange={() => updateSetting('clearing', !isRating)}
                />}>
                Участвовать в рейтинге
            </Cell>
            <Cell
                disabled
                after={<Switch
                    checked={isPublic}
                    onChange={() => updateSetting('publicProfile', !isPublic)}
                />}>
                Публичная статистика
            </Cell>
        </Group>
        <Group header={<Header mode="secondary">Контакты</Header>}>
            <Cell onClick={() => window.open("https://vk.me/public207277087", "_blank")}>Обратная связь</Cell>
            <Cell onClick={() => window.open("https://vk.com/public207277087", "_blank")}>Официальное сообщество</Cell>
        </Group>
        <Separator/>
    </div>
}

export default ProfileSettings