import {Icon16ErrorCircleFill} from "@vkontakte/icons";
import {Snackbar} from "@vkontakte/vkui";
import React from "react";

const ErrorSnackbar = ({text, close}: {text: string, close: () => void}) => {
    return <Snackbar
        onClose={close}
        before={<Icon16ErrorCircleFill width={24} height={24} />}
    >
        {text}
    </Snackbar>
}

export default ErrorSnackbar