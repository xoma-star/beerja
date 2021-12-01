import {
    Button,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    FormLayout,
    FormItem,
    Input,
    IconButton,
    Header,
    Title,
    PanelHeaderBack,
    Checkbox,
    Group,
    Caption,
    Cell,
    List,
    Avatar, Placeholder
} from "@vkontakte/vkui";
import React, {useState} from "react";
import {
    Icon20CheckCircleFillGreen,
    Icon24Add,
    Icon24Cancel,
    Icon56GestureOutline,
    Icon56HideOutline
} from "@vkontakte/icons";
import fs from "../Functions/Firebase";
import StocksData from "../Functions/StocksData";
import SmallChart from "./TradingView/SmallChart";
import AnalyticsBlock from "./AnalyticsBlock";

const Modal = (p) => {
    const [type, setType] = useState(null);
    const [input, updateInput] = useState(0);
    const [marginable, setMarginable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAllHistory, setShowAllHistory] = useState(false);

    let stockModal = null;

    const closeModal = () => {
        p.s(null, p.t);
        setTimeout(() => {
            setType(null);
            updateInput(0);
            setMarginable(false);
            setLoading(false);
            setShowAllHistory(false);
        }, 250);
    }
    const ruFormat = (a) => {
        if(a) return new Intl.NumberFormat('ru-RU').format(a.toFixed(2));
        return ''
    }

    if(p.v === 'stock'){
        if(!p.t){
            return '';
        }
        if(p.t.ticker === ''){
            return '';
        }
        if(p.t.ticker === 'RUBRUB'){
            return '';
        }
        let isBuying = -1;
        let rubToUsd = 1 / p.q.usd.val;
        if(type === 'sell'){
            isBuying = 1;
        }
        let isCurency = ['RUBCHF', 'RUBUSD', 'RUBEUR', 'RUBGBP'].indexOf(p.t.ticker) >= 0;
        let isCommodity = p.t.ticker.indexOf('#') >= 0;
        let commission = p.u.commission;
        let lots = 1;
        if(p.t.price < 10){
            lots = 10;
        }
        if(p.t.price < 1){
            lots = 100;
        }
        if(p.t.price < 0.1){
            lots = 1000;
        }
        let availableS = Math.floor(Number(lots * p.c.usd.count / p.t.price * (1 - commission)));
        let availableC = Math.floor(Number(lots * p.c.rub.count / p.t.price * (1 - commission)));
        let availableCL = Math.floor(Number((lots * p.u.rubValueAvailable) / p.t.price * (1 - commission)));
        let availableSL = Math.floor(Number(lots * p.u.rubValueAvailable * rubToUsd / p.t.price * (1 - commission)));
        let available;
        let availableL;
        if(isCurency){
            available = availableC;
            availableL = availableCL;
        }
        else{
            available = availableS;
            availableL = availableSL;
        }
        if(type === 'sell'){
            available = parseInt(p.t.count);
            // availableL += parseInt(p.t.count);
        }
        if(available < 0){
            available = 0;
        }
        if(availableL < available || !p.e){
            availableL = available;
        }

        const formatInput = (t) => {
            t = String(t);
            if(t.charAt(0) === '0' && Number(t) < 10){
                t = t.substr(1);
            }
            if(t.length === 0){
                t = '0';
            }
            if(typeof t !== 'number') {
                t = t.replace(/[^0-9]/g, '');
            }
            if(t === 0 || t > available){
                setMarginable(false);
            }
            return Number(t);
        }
        const makeDeal = () => {
            let a = isBuying;
            let c;
            let y = Object.assign(p.c);
            let x = [...p.p];
            let z = Object.assign(p.g);
            if(isCurency){
                y.rub.count += lots * input * (a * p.t.price - commission * p.t.price);
                switch (p.t.ticker) {
                    case 'RUBCHF':
                        y.chf.count += lots * a * - 1 * input;
                        y.chf.avgPrice = (p.c.chf.avgPrice * Math.abs(p.c.chf.count) + lots * input * p.t.price) / (Math.abs(p.c.chf.count) + lots * input);
                        break;
                    case 'RUBEUR':
                        y.eur.count += lots * a * - 1 * input;
                        y.eur.avgPrice = (p.c.eur.avgPrice * Math.abs(p.c.eur.count) + lots * input * p.t.price) / (Math.abs(p.c.eur.count) + lots * input);
                        break;
                    case 'RUBUSD':
                        y.usd.count += lots * a * - 1 * input;
                        y.usd.avgPrice = (p.c.usd.avgPrice * Math.abs(p.c.usd.count) + lots * input * p.t.price) / (Math.abs(p.c.usd.count) + lots * input);
                        break;
                    case 'RUBGBP':
                        y.gbp.count += lots * a * - 1 * input;
                        y.gbp.avgPrice = (p.c.gbp.avgPrice * Math.abs(p.c.gbp.count) + lots * input * p.t.price) / (Math.abs(p.c.gbp.count) + lots * input);
                        break;
                    default:
                        return
                }

            }
            else if(isCommodity){
                y.usd.count += lots * input * p.t.price * (a - commission);
                let ticker = p.t.ticker.substr(1);
                if(z[ticker]){
                    z[ticker] = {
                        avgPrice: (z[ticker].avgPrice * Math.abs(z[ticker].count) + lots * input * p.t.price) / (Math.abs(z[ticker].count) + lots * input),
                        count: z[ticker].count + lots * input * a * -1
                    }
                    if(z[ticker].count === 0){
                        delete z[ticker];
                    }
                }
                else{
                    z[ticker] = {
                        avgPrice: p.t.price,
                        count: input * a * -1 * lots
                    }
                }
            }
            else{
                // y.usd.avgPrice = (p.c.usd.avgPrice * p.c.usd.count + lots * input * p.t.price * p.q.usd.val) / (p.c.usd.count + lots * input * p.t.price);
                if(y.usd.avgPrice === 0){
                    y.usd.avgPrice = p.q.usd.val;
                }
                y.usd.count += lots * input * p.t.price * (a - commission);
                let i = 0;
                for (const v of x) {
                    if(v.ticker === p.t.ticker){
                        c = {
                            ticker: v.ticker,
                            avgPrice: (v.avgPrice * Math.abs(v.count) + input * p.t.price * lots) / (Math.abs(v.count) + input * lots),
                            count: v.count + input * a * -1 * lots
                        }
                        x[i] = c;
                        break;
                    }
                    i++;
                }
                if(!c){
                    c = {
                        ticker: p.t.ticker,
                        avgPrice: p.t.price,
                        count: input * a * -1 * lots
                    }
                    x.push(c);
                }
                for(let i = 0; i < x.length; i++) {
                    x[i] = {
                        ticker: x[i].ticker,
                        avgPrice: x[i].avgPrice,
                        count: x[i].count
                    }
                    // delete x[i].price;
                    // delete x[i].name;
                    if(x[i].count === 0){
                        x.splice(i, 1);
                    }
                }
            }
            if(!x){
                x = [];
            }
            p.h.push({
                action: type,
                price: p.t.price,
                count: input * lots,
                date: new Date(),
                ticker: p.t.ticker,
                isCurency: isCurency,
                commission: commission
            })
            setLoading(true);
            fs.collection('users').doc(p.vkuid).update({
                portfolio: x,
                currencies: p.c,
                deals: p.h,
                commodities: z
            }).then(() => {
                p.d(type, ruFormat(input * lots), ruFormat(p.t.price), p.t.ticker);
                closeModal();
            });
        }
        const isMarginable = () => {
            if(input === 0){
                return false;
            }
            if(type === 'sell'){
                return p.t.count - input < 0 && input <= availableL;
            }
            else{
                return available < input && availableL >= input;
            }
        }

        const Description = () => {
            // if(isCurency) return ''
            if(type !== null) return ''
            if(isCommodity) return ''
            return <Group header={<Header mode={'secondary'}>О компании</Header>}>
                <SmallChart currency={isCurency} ticker={p.t.ticker} scheme={p.scheme}/>
                <FormItem>
                    {p.t.description ? p.t.description : ''}
                </FormItem>
            </Group>
        }
        const SellBuyButtons = () => {
            return <FormItem style={{display: 'flex'}}>
                <Button onClick={() => {setType('buy')}} mode={"commerce"} stretched size={"l"}>Купить</Button>
                <div style={{width: 10}}/>
                <Button onClick={() => {setType('sell')}} mode={"destructive"} stretched size={"l"}>Продать</Button>
            </FormItem>
        }
        const mainPart = () => {
            if(loading) return ''
            return <div>
                <FormItem>
                    <Title level={1} weight={'bold'}>{type === 'buy' ? 'Покупка' : 'Продажа'}</Title>
                </FormItem>
                <FormItem>
                    <Input disabled value={parseFloat(p.t.price).toFixed(2) + ' ' + p.t.sign}/>
                </FormItem>
                <FormItem>
                    <Title level={1} weight={'bold'}>Количество</Title>
                </FormItem>
                <FormItem bottom={input <= availableL ?
                    <div>
                        Доступно
                        <p onClick={() => updateInput(available)} style={{display: 'inline', color: 'var(--header_text)'}}> {available}</p> лотов
                        {p.e ?
                            <div style={{display: 'inline'}}> (<p
                                onClick={() => updateInput(availableL)}
                                style={{display: 'inline', color: 'var(--header_text)'}}>{availableL}</p> с плечом)</div> : ``}
                        <br/>
                        1 лот - {lots} шт.
                    </div> :
                    <div style={{color: 'var(--dynamic_red)'}}>Недостаточно средств</div>
                }>
                    <Input //autoFocus плохо работает с этим
                        // type={'number'} плохо с форматинпут
                        after={
                            <div style={{display: 'flex'}}>
                                {input !== 0 ? <IconButton icon={<Icon24Cancel onClick={() => updateInput(0)}/>}/> : ''}
                                <IconButton icon={<Icon24Add onClick={() => {updateInput(formatInput(Number(input) + 1))}}/>}/>
                            </div>
                        }
                        onChange={(e) => updateInput(formatInput(Number(e.target.value)))}
                        value={input}
                    />
                </FormItem>
                {isMarginable() ? <FormItem>
                    <Checkbox onChange={() => setMarginable(!marginable)}>Маржинальная сделка</Checkbox>
                </FormItem> : ''}
                {input !== 0 && input <= availableL ? <FormItem>
                    <Cell
                        style={{paddingLeft: 12, paddingRight: 12}}
                        after={ruFormat((lots * input * p.t.price * commission))+' '+p.t.sign}
                        description={'Коммиссия'}/>
                    <Cell
                        style={{paddingLeft: 12, paddingRight: 12}}
                        after={ruFormat((lots * input * p.t.price * (1 - isBuying * commission)))+' '+p.t.sign}
                        description={'Итого'}/>
                </FormItem> : ''}
            </div>
        }
        stockModal = <div>
            {Description()}
            <FormLayout>
                {p.m === 'close1' || p.m === 'close2' || isNaN(p.t.price) ? <Button disabled stretched size={'l'} mode={'secondary'}>Биржа закрыта</Button> :
                    type === null ?
                        SellBuyButtons()
                        :
                        <div>
                            {mainPart()}
                            <FormItem>
                                <Button disabled={
                                    loading ||
                                    input === 0 ||
                                    (input > available && !marginable) ||
                                    input > availableL
                                }       onClick={makeDeal}
                                        size={"l"}
                                        stretched
                                        loading={loading}>
                                    {type === 'buy' ? 'Купить' : 'Продать'}
                                </Button>
                            </FormItem>
                        </div>
                }
            </FormLayout>
        </div>
    }

    return <ModalRoot activeModal={p.v} onClose={closeModal}>
        <ModalPage
            id={"stock"}
            header={p.t ? <ModalPageHeader left={<PanelHeaderBack onClick={closeModal}/>}><Header>{p.t.name}</Header></ModalPageHeader> : ''}
            dynamicContentHeight
            // settlingHeight={100}
        >{stockModal}</ModalPage>
        <ModalPage
            dynamicContentHeight
            id={'history'}
            header={<ModalPageHeader left={<PanelHeaderBack onClick={closeModal}/>}><Header>Сделки</Header></ModalPageHeader>}>
            <List>
                {p.h.length > 0 ? p.h.map((_t,i,a) => {
                    let v = a[a.length-i-1];
                    let s = v.isCurency ? '₽' : '$';
                    let o = v.action === 'sell' ? 'Продажа' : 'Покупка';
                    let m = v.action === 'sell' ? '+' : '-';
                    let d = StocksData[v.ticker];
                    let t;
                    let tn = new Date(a[a.length-i-1].date.seconds*1000);
                    if(i !== 0 && a.length - i > 0){
                        let tt = new Date(a[a.length - i].date.seconds*1000);
                        if(tn.getDate() !== tt.getDate()){
                            t = tn;
                        }
                    }
                    const ms = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
                    if(0 === i){
                        t = new Date(v.date.seconds*1000);
                    }
                    t ? t = <Header mode={'secondary'}>{t.getDate() + ' ' + ms[t.getMonth()]}</Header> : t = null;
                    if(i === 30 && !showAllHistory){
                        return <Placeholder key={'endstory'}
                                            icon={<Icon56HideOutline/>}
                                            header={<Header>Показаны последние сделки</Header>}
                                            action={<Button onClick={() => setShowAllHistory(true)}>Показать все</Button>}
                        />
                    }
                    if(i > 30 && !showAllHistory){
                        return '';
                    }
                    if(v.action === 'bonus'){
                        return <div key={'bonus'+i}>
                            {t}
                            <Cell disabled key={`bonus${i}`}
                                  indicator={
                                      <Title
                                          style={{color: `var(--dynamic_green)`}}
                                          level={3}
                                          weight={'regular'}>
                                          {`+${ruFormat(v.count)} ₽`}
                                      </Title>
                                  }
                                  before={<Avatar size={32}><Icon20CheckCircleFillGreen width={32} height={32}/></Avatar>}>
                                <Title level={3} weight={"regular"}>Ежедневный бонус</Title>
                            </Cell>
                        </div>
                    }
                    return <div key={v.ticker+v.date.seconds}>
                        {t}
                        <Cell disabled
                            description={
                                <Caption
                                    level={2}
                                    weight={"regular"}>
                                    {`${o} ${ruFormat(v.count)} шт. · ${ruFormat(v.price)} ${s}`}
                                </Caption>
                            }
                            indicator={
                                <Title
                                    style={v.action === 'sell' ? {color: 'var(--dynamic_green)'} : {color: 'var(--header_text)'}}
                                    level={3}
                                    weight={'regular'}>
                                    {m + ruFormat(v.count*v.price) + ' ' + (s)}
                                </Title>
                            }
                            before={<Avatar size={32}
                                            src={require(`../Logos/${d.logo}`).default}
                            />}>
                            <Title level={3} weight={"semibold"}>{d.name}</Title>
                        </Cell>
                        <Cell disabled
                            indicator={
                                <Title
                                    style={{color: 'var(--header_text)'}}
                                    level={3}
                                    weight={'regular'}>
                                    {`${ruFormat(v.count * v.price * -v.commission)} ${s}`}
                                </Title>
                            }
                            before={<Avatar size={32}>
                                <img alt={'.!.'} className='taxIcon' width={24} height={24} src={require('../Logos/taxes.png').default}/>
                            </Avatar>}>
                            <Title level={3} weight={"regular"}>Комиссия за сделки</Title>
                        </Cell>
                    </div>
                }) : <Placeholder icon={<Icon56GestureOutline/>}>Сделок еще не было</Placeholder>}
            </List>
        </ModalPage>
        <ModalPage
            dynamicContentHeight
            id={'analytics'}
            header={<ModalPageHeader left={<PanelHeaderBack onClick={closeModal}/>}><Header>Аналитика</Header></ModalPageHeader>}
        >
            <AnalyticsBlock v={p.u}/>
        </ModalPage>
    </ModalRoot>
}

export default Modal;