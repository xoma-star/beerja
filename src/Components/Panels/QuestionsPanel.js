import {Avatar, Cell, PanelHeader, PanelHeaderBack, Title} from "@vkontakte/vkui";
import React from "react";
import FAQ from "../../Functions/FAQ";
import {Icon28QuestionOutline} from "@vkontakte/icons";
import Gradients from "../../Functions/Gradients";

const QuestionsPanel = ({back, openModal}) => {
    return <div>
        <PanelHeader left={<PanelHeaderBack onClick={back}/>}>Частые вопросы</PanelHeader>
        {FAQ.map((v, i) =>
            <Cell
                key={v.label}
                description={v.subheader}
                multiline
                before={<Avatar style={{background: Gradients[i % Gradients.length]}}><Icon28QuestionOutline fill="#fff"/></Avatar>}
                onClick={() => openModal('questions', v)}
            >
                <Title weight="semibold" level="3">{v.label}</Title>
            </Cell>)}
    </div>
}

export default QuestionsPanel