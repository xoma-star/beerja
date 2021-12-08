import {CardScroll, Group, Header, Placeholder} from "@vkontakte/vkui";
import StockCardHorizontal from "./StockCardHorizontal";
import {Icon28IncognitoOutline} from "@vkontakte/icons";
import React from "react";

const ProfilePortfolio = ({portfolio, commodities}) => {
    return <div>
        <Group header={<Header mode={'secondary'}>Акции</Header>}>
            {portfolio.length > 0 ?
                <CardScroll>
                    {portfolio.map(v => <StockCardHorizontal key={'hor'+v.ticker} v={v.ticker}/>)}
                </CardScroll>
                :
                <Placeholder icon={<Icon28IncognitoOutline width={56} height={56}/>}>У пользователя нет акций</Placeholder>
            }
        </Group>
        {Object.keys(commodities).length > 0 ?
            <Group header={<Header mode={'secondary'}>Товары</Header>}>
                <CardScroll>
                    {Object.keys(commodities).map(v =>
                        <StockCardHorizontal
                            key={'hor'+v}
                            v={'#'+v}
                        />)}
                </CardScroll>
            </Group>: ''}
    </div>
}

export default ProfilePortfolio