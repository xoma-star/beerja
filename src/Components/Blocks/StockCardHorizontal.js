import {Avatar, HorizontalCell} from "@vkontakte/vkui";
import StocksData from "../../Functions/StocksData";
import React from "react";

const StockCardHorizontal = (p) => {
    let d = StocksData[p.v];
    return <HorizontalCell disabled>
        <Avatar size={64}
                src={require(`../../Logos/${d.logo}`).default}
        />
    </HorizontalCell>
}

export default StockCardHorizontal;