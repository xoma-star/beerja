import {Icon56LockOutline} from "@vkontakte/icons";
import {Placeholder} from "@vkontakte/vkui";
import React from "react";

const ProfilePrivatePlaceholder = () => {
    return <Placeholder
        icon={<Icon56LockOutline/>}
        header={'Закрытый профиль'}>Пользователь предпочел скрыть статистику</Placeholder>
}

export default ProfilePrivatePlaceholder