import {Avatar, Gradient, Title} from "@vkontakte/vkui";
import React from "react";

const ProfileHeader = ({userData}) => {
    return <Gradient style={
        {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,

        }
    }>
        <Avatar size={96} style={{marginBottom: 10}} src={userData.photo_200}/>
        <Title weight={'semibold'} level="1">
            {userData.last_name ? `${userData.first_name} ${userData.last_name.substr(0, 1)}.` : ''}
        </Title>
    </Gradient>
}

export default ProfileHeader