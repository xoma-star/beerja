import {Group} from "@vkontakte/vkui";
import React from "react";
import MarketSections from "../../Functions/MarketSections";
import MarketCurrentStatus from "./MarketCurrentStatus";
import MarketProgress from "./MarketProgress";
import MarketStatesList from "./MarketStatesList";

const MarketBlock = (p) => {
    const states = {
        close1: {
            description: 'Биржа закрыта',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            },
            className: 'close'
        },
        pre: {
            description: 'Предторговый период',
            colors: {
                background: '#ffa0007F',
                element: 'var(--dynamic_orange)'
            },
            className: 'pre'
        },
        open: {
            description: 'Рынок открыт',
            colors: {
                background: '#4bb34b80',
                element: 'var(--dynamic_green)'
            },
            className: 'open'
        },
        post: {
            description: 'Послеторговый период',
            colors: {
                background: '#5c9ce69e',
                element: 'var(--blue_200)'
            },
            className: 'post'
        },
        close2: {
            description: 'Биржа закрыта',
            colors: {
                background: 'var(--dynamic_gray)',
                element: 'var(--dynamic_gray)'
            },
            className: 'close'
        }
    }
    const add0 = (a) => {
        if(a < 10){
            return '0' + a
        }
        return a
    }
    let a = MarketSections();
    let values = a.progress;
    return <Group className={a.isDayOff ? 'paddingBottom0' : ''}>
        <MarketCurrentStatus
            nameClass={states[p.m].className}
            color={states[p.m].colors.element}
            description={states[p.m].description}
            isDayOff={a.isDayOff}
            isDaySpecial={a.isDaySpecial}
        />
        <div style={a.isDayOff ? {display: 'none'} : {}}>
            <MarketProgress
                add0={add0}
                values={values}
                start={{
                    hours: add0(a.workingHours.start[0]),
                    minutes: add0(a.workingHours.start[1])
                }}
                end={{
                    hours: add0(a.workingHours.end[0]),
                    minutes: add0(a.workingHours.end[1])
                }}
            />
            <MarketStatesList states={states}/>
        </div>
    </Group>
}

export default MarketBlock;