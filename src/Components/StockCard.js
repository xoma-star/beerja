import React from "react";
import {Avatar, Caption, Cell, Title} from "@vkontakte/vkui";
import StocksData from "../Functions/StocksData";

const StockCard = (p) => {
    let c = p.c;
    let v = p.v;
    let a = p.a;
    let b = p.b;
    let d = StocksData[v];
    let x = ((c / a) * 100 - 100).toFixed(2);
    let y = c - a;
    return <Cell
        onClick={() => {p.s('stock', v)}}
        before={<Avatar size={32} src={require(`../Logos/${d.logo}`).default}/>}
        description={p.p ? <Caption level={2} weight={"regular"}>3x{c.toFixed(2)}$</Caption> : ''}
        indicator={<div style={{textAlign: "right"}}>
            <Title style={{color: '#000'}} level={3} weight={"medium"}>{p.p ? (3*c).toFixed(2) : c.toFixed(2)}$</Title>
            <Caption style={x >= 0 ? {color: 'var(--dynamic_green)'} : {color: 'var(--dynamic_red)'}} level={2} weight={"regular"}>{y.toFixed(2)}$ ({x}%)</Caption>
        </div>}
    >
        <Title level={3} weight={"semibold"}>{d.name}</Title>
    </Cell>
}

export default StockCard;