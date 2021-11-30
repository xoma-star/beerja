import './App.css';
import React from "react";
import '@vkontakte/vkui/dist/vkui.css';
import {
    AdaptivityProvider,
    ConfigProvider,
    AppRoot,
    SplitLayout,
    Panel,
    View,
    Epic,
    Tabbar,
    TabbarItem,
    Group,
    CardScroll,
    Header,
    withPlatform,
    FixedLayout,
    Snackbar,
    Avatar,
    PullToRefresh, Root
} from "@vkontakte/vkui";
import {
    Icon16Done, Icon16ErrorCircleFill, Icon20CheckCircleFillGreen,
    Icon24CupOutline,
    Icon24SartOutline, Icon24UserOutline,
    Icon24WorkOutline,
} from '@vkontakte/icons';
import BalanceCards from "./Components/BalanceCards";
import fs from "./Functions/Firebase.js";
import StocksData from "./Functions/StocksData";
import Modal from "./Components/Modal";
import StockCardHorizontal from "./Components/StockCardHorizontal";
import bridge from "@vkontakte/vk-bridge";
import CurrenciesGroup from "./Components/CurrenciesGroup";
import OperationCards from "./Components/OperationCards";
import MarginCards from "./Components/MarginCards";
import CommoditiesGroup from "./Components/CommoditiesGroup";
import ErrorBlock from "./Components/ErrorBlock";
import StockGroup from "./Components/StockGroup";
import MarketBlock from "./Components/MarketBlock";
import MarketSections from "./Functions/MarketSections";
import RatingPanel from "./Components/RatingPanel";
import ProfilePanel from "./Components/ProfilePanel";

const unique = (value, index, self) => {
    return self.indexOf(value) === index;
}

class App extends React.Component{
    constructor(props) {
        const qs = require('querystring');
        const urlParams = qs.parse(window.location.search.substr(1));
        super(props);
        this.state = {
            vk_user_id: urlParams.vk_user_id.toString(),
            activePanel: 'portfolio',
            activeStock: {ticker: ''},
            portfolio: [],
            cash: [],
            currencies: {},
            stocksMarket: [],
            modal: null,
            loading: true,
            scheme: 'bright_light',
            stocksAvailable: [],
            stocksAvailableNextWeek: [],
            AlpacaConnected: false,
            snackBar: '',
            deals: [],
            isMarketOpen: 'close1',
            lastBonusTaken: Infinity,
            marginable: false,
            commoditiesAvailable: {},
            commodities: {},
            errors: [],
            bonusLoading: false,
            fetching: false,
            balance: 0,
            access_token: null,
            publicProfile: true,
            isRatingParticipant: true,
            observerProfile: 0,
            activeView: 'main'
        }
        this.api_key = 'CKB1ZOZN09CF26RO6LPJ';
        this.api_secret = 'cBuWsqBlsuB5aAf8c0qqHrL9jy5SWqX3kY9e6Qao';
        this.setActiveModal = this.setActiveModal.bind(this);
        this.setActivePanel = this.setActivePanel.bind(this);
        this.userDataUpdatesSubscribe = this.userDataUpdatesSubscribe.bind(this);
        this.stocksSubscribe = this.stocksSubscribe.bind(this);
        this.dealComplete = this.dealComplete.bind(this);
        this.marketOpen = this.marketOpen.bind(this);
        this.userValue = this.userValue.bind(this);
        this.takeDailyBonus = this.takeDailyBonus.bind(this);
        this.changeMarginStatus = this.changeMarginStatus.bind(this);
        this.openDeals = this.openDeals.bind(this);
        this.getCommodities = this.getCommodities.bind(this);
        this.getPrice = this.getPrice.bind(this);
        this.refresh = this.refresh.bind(this);
        this.openAnal = this.openAnal.bind(this);
        this.setActiveView = this.setActiveView.bind(this);
    }
    async componentDidMount() {
        await this.connectAlpacaWSS();
        await bridge.subscribe(e => {
            if(e.detail.type === 'VKWebAppUpdateConfig'){
                this.setState({
                    scheme: e.detail.data.scheme
                });
            }
        });
        bridge.send('VKWebAppInit').then(() =>{
            bridge.send("VKWebAppGetAuthToken", {"app_id": 8000440, "scope": "friends,status"}).then(
                v => {
                    this.setState({access_token: v.access_token})
                }
            )
        });
        this.marketOpen();
        await this.userDataUpdatesSubscribe();
        await this.stocksSubscribe();
        await this.getCurrencyData();
        await this.getCommodities();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.AlpacaConnected){
            let a = [...this.state.portfolio, ...this.state.stocksMarket];
            let c = [...prevState.portfolio, ...prevState.stocksMarket];
            let b = [];
            let d = [];
            for(const v of a){
                b.push(v.ticker);
            }
            for(const v of c){
                d.push(v.ticker);
            }
            if(b.filter(unique).length !== d.filter(unique).length){
                this.AlpacaSend('subscribe');
            }
        }
    }
    stocksSubscribe(){
        fs.collection('users').doc('-1').onSnapshot(
            async e => {
                this.pushStock(e.data().thisweek).then(v => {
                    this.setState({
                        stocksMarket: v
                    })
                });
                this.setState({
                    stocksAvailableNextWeek: e.data().nextweek,
                    commoditiesAvailableNow: e.data().commodities
                });
            }
        );
    }
    userValue(){
        const leverage = 5;
        const commission = 0.0005;
        let c = this.state.currencies;
        if(!c.chf){
            return {}
        }
        let CHFUSD = c.chf.val / c.usd.val;
        let GBPUSD = c.gbp.val / c.usd.val;
        let EURUSD = c.eur.val / c.usd.val;
        let RUBUSD = c.rub.val / c.usd.val;
        let rates = {
            usd: 1,
            chf: CHFUSD,
            gbp: GBPUSD,
            eur: EURUSD,
            rub: RUBUSD
        }
        let usdValue = 0;
        let usdAbs = 0;
        let currenciesVal = 0, stocksVal = 0, commoditiesVal = 0;
        this.state.portfolio.forEach(v => {
            usdValue += v.price * v.count;
            if(v.count > 0){
                usdAbs += Math.abs(v.price * v.count);
                stocksVal += v.price * v.count;
            }
        });
        for (const [k, v] of Object.entries(this.state.cash)) {
            usdValue += v.count * rates[k];
            if(v.count > 0) {
                usdAbs += Math.abs(v.count * rates[k]);
                currenciesVal += v.count * rates[k];
            }
        }
        for (const [, v] of Object.entries(this.state.commodities)) {
            usdValue += v.count * v.avgPrice;
            if(v.count > 0) {
                usdAbs += Math.abs(v.count * v.avgPrice);
                commoditiesVal += v.count * v.avgPrice;
            }
        }
        let eurValue = usdValue / EURUSD;
        let rubValue = usdValue / RUBUSD;
        let naked = (usdAbs - usdValue) / RUBUSD;
        // let avail = rubValue * leverage - naked;
        let avail = (usdValue * leverage - usdAbs) / RUBUSD;
        if(!naked){
            avail += rubValue;
        }
        return {
            usdValue: usdValue,
            eurValue: eurValue,
            rubValue: rubValue,
            rubValueNaked: naked,
            rubValueAvailable: avail > 0 ? avail : 0,
            leverage: leverage,
            commission: commission,
            values: {
                stocks:  stocksVal / RUBUSD,
                currencies: currenciesVal / RUBUSD,
                commodities: commoditiesVal / RUBUSD
            }
        }
    }
    async getCommodities(){
        let a;
        let b;
        let c;
        await fs.collection('users').doc('-2').get().then(async e => {
            if(new Date().getTime() - e.data().commodities.updated*1000 > 1000*8*60*60){
                let symbols = 'COFFEE%2CWHEAT%2CSUGAR%2CCORN%2CSOYBEAN%2CRICE%2CALU%2CBRENTOIL%2CLCO%2CXCU%2CCOTTON%2CXAU%2CIRD%2CNI%2CXPD%2CXPT%2CXRH%2CXAG%2CTIN%2CWTIOIL%2CZNC';
                let access_key = 'k75br6f333zn5t2d66yuw3hfe12i9n6dlnxheqqyvmrt73t9r52w5qtek973';
                await fetch('https://commodities-api.com/api/latest?access_key='+access_key+'&base=USD&symbols='+symbols).then(async e => {
                    a = await Promise.resolve(e.json());
                });
                let nd = new Date((a.data.timestamp - 24*60*60)*1000);
                nd = nd.getFullYear()+'-'+(nd.getMonth()+1)+'-'+nd.getDate();
                await fetch('https://commodities-api.com/api/'+nd+'?access_key='+access_key+'&base=USD&symbols='+symbols).then(async e => {
                    c = await Promise.resolve(e.json());
                });
                b = {
                    updated: await a.data.timestamp,
                    rates: await a.data.rates,
                    ratesBefore: await c.data.rates
                }
                await fs.collection('users').doc('-2').update({
                    commodities: b
                })
            }
            else{
                b = {
                    rates: e.data().commodities.rates,
                    ratesBefore: e.data().commodities.ratesBefore
                }
            }
        })
        await this.setState({commoditiesAvailable: b});
    }
    async getCurrencyData(){
        let a;
        await fetch('https://www.cbr-xml-daily.ru/daily_json.js', {cache: 'no-cache'}).then(async e => {
            a = await Promise.resolve(e.json());
            this.setState({currencies: {
                    rub: {val: 1, ticker: 'RUBRUB', valPrev: 1},
                    usd: {val: parseFloat(a.Valute.USD.Value), ticker: 'RUBUSD', valPrev: parseFloat(a.Valute.USD.Previous)},
                    eur: {val: parseFloat(a.Valute.EUR.Value), ticker: 'RUBEUR', valPrev: parseFloat(a.Valute.EUR.Previous)},
                    chf: {val: parseFloat(a.Valute.CHF.Value), ticker: 'RUBCHF', valPrev: parseFloat(a.Valute.CHF.Previous)},
                    gbp: {val: parseFloat(a.Valute.GBP.Value), ticker: 'RUBGBP', valPrev: parseFloat(a.Valute.GBP.Previous)}
                }});
        });
        //return await Promise.resolve(a);
    }
    userDataUpdatesSubscribe(){
        fs.collection('users').doc(this.state.vk_user_id).onSnapshot(
            e => {
                this.portfolioInit(e.data().portfolio).then(v =>
                    this.setState({
                        portfolio: v,
                        cash: e.data().currencies,
                        deals: e.data().deals,
                        loading: false,
                        lastBonusTaken: e.data().lastBonusTaken,
                        marginable: e.data().marginable,
                        commodities: e.data().commodities,
                        tier: e.data().tier,
                        balance: e.data().balance,
                        isRatingParticipant: e.data().clearing,
                        publicProfile: e.data().publicProfile
                    })
                );
            }
        );
    }
    connectAlpacaWSS(){
        this.ws = new WebSocket('wss://stream.data.sandbox.alpaca.markets/v2/iex');
        this.ws.onopen = () => {
            this.AlpacaSend('auth');
        };
        this.ws.onmessage = (e) => {
          let a = JSON.parse(e.data)[0];
          if(a.msg === 'authenticated'){
              this.setState({AlpacaConnected: true});
          }
          if(a.T === 't'){
              this.stockPriceUpdate(a.S, a.p);
          }
          if(a.T === 'error'){
              this.setState({errors: [...this.state.errors, a.code]});
          }
        }
    }
    AlpacaSend(method){
        if(method === 'auth'){
            this.ws.send('{"action":"auth","key":"CKB1ZOZN09CF26RO6LPJ","secret":"cBuWsqBlsuB5aAf8c0qqHrL9jy5SWqX3kY9e6Qao"}');
            return;
        }
        if(method === 'subscribe'){
            let a = [...this.state.portfolio, ...this.state.stocksMarket];
            let b = [];
            for(const v of a){
                b.push(v.ticker);
            }
            if(b.length === 0){
                return;
            }
            this.ws.send(JSON.stringify({action:"subscribe",trades:b.filter(unique)}));
            // return;
        }
    }
    takeDailyBonus(){
        const bonus = 100000;
        if(new Date().getDate() === new Date(this.state.lastBonusTaken).getDate()){
            this.setState({
                snackBar: <Snackbar
                    onClose={() => this.setState({snackBar: null})}
                    before={<Icon16ErrorCircleFill width={24} height={24} />}
                >
                    Бонус можно будет получить завтра
                </Snackbar>
            })
            return;
        }
        this.setState({bonusLoading: true})
        bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
            .then(data => {
                if(!data){
                    this.setState({
                        snackBar: <Snackbar
                            onClose={() => this.setState({snackBar: null})}
                            before={<Icon16ErrorCircleFill width={24} height={24} />}
                        >
                            Посмотрите рекламу до конца
                        </Snackbar>
                    })
                }
                let a = Object.assign(this.state.cash);
                a.rub.count += bonus;
                let b = [...this.state.deals];
                b.push({
                    action: 'bonus',
                    count: bonus,
                    date: new Date()
                });
                fs.collection('users').doc(this.state.vk_user_id).update({
                    lastBonusTaken: new Date().getTime(),
                    currencies: a,
                    deals: b,
                    balance: this.state.balance + bonus
                }).then(() => this.setState({
                    snackBar: <Snackbar
                        onClose={() => this.setState({snackBar: null})}
                        before={<Icon20CheckCircleFillGreen width={24} height={24} />}
                    >
                        На счет зачислено 100 000 ₽
                    </Snackbar>,
                    bonusLoading: false
                }))
            })
    }
    openDeals(){
        this.setActiveModal('history', null);
    }
    stockPriceUpdate(ticker, price){
        let a = this.state.portfolio;
        if(this.state.modal === 'stock'){
            if(this.state.activeStock.ticker === ticker){
                let c = this.state.activeStock;
                c.price = price;
                this.setState({activeStock: c});
            }
        }
        let now = new Date().getTime();
        const delay = 5000;
        for(let i = 0; i < a.length; i++){
            if(a[i].ticker === ticker){
                if(now - a[i].updated < delay){
                    return;
                }
                a[i].price = price;
                a[i].updated = now;
                this.setState({
                    portfolio: a
                });
                if(typeof(this.state.stocksMarket.find(v => v.ticker === ticker)) === 'undefined'){
                    return;
                }
            }
        }
        let b = this.state.stocksMarket;
        for(let i = 0; i < b.length; i++){
            if(b[i].ticker === ticker){
                if(now - b[i].updated < delay){
                    return;
                }
                b[i].price = price;
                b[i].updated = now;
                this.setState({
                    stocksMarket: b
                });
                return;
            }
        }
    }
    async portfolioInit(stocks){
        let a = [];
        let n = this.state.portfolio;
        for (const v of stocks) {
            let i;
            let t = n.find(x => x.ticker === v.ticker);
            if(!t){
                await this.getPrice(v.ticker).then(e => {
                    i = e.trade.p
                });
            }
            else{
                i = t.price
            }
            a.push({
                ticker: v.ticker,
                name: StocksData[v.ticker].name,
                price: await i,
                avgPrice: v.avgPrice,
                count: v.count,
                updated: new Date().getTime()
            });
        }
        return a;
    }
    async pushStock(t){
        let a = [];
        let n = this.state.stocksMarket;
        for(const v of t){
            let t = n.find(x => x.ticker === v);
            let i;
            let j;
            if(!t){
                await this.getPrice(v).then(e => {
                    i = e.trade;
                })
                j = await this.getPrice(v, await i.t);
            }
            else{
                i = {p: t.price};
                j = {trades: [{p: t.priceBefore}]}
            }
            a.push({
                ticker: v,
                name: StocksData[v].name,
                price: await i.p,
                priceBefore: await j.trades[0].p,
                updated: new Date().getTime()
            });
        }
        return a;
    }
    marketOpen(){
        setInterval(() => {
            let a = MarketSections();
            if(this.state.isMarketOpen !== a.now && !a.isDayOff){
                this.setState({isMarketOpen: a.now})
            }
        }, 5000)
    }
    async getPrice(ticker, date=null){
        let a;
        let u = 'https://data.sandbox.alpaca.markets/v2/stocks/'+ticker+'/trades/latest';
        if(date !== null){
            u = 'https://data.sandbox.alpaca.markets/v2/stocks/'+ticker+'/trades?limit=10&start='+(new Date(Date.parse(date) - 1000*24*60*60).toISOString())
        }
        await fetch(
            u,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Basic ' + window.btoa(this.api_key+':'+this.api_secret)
                }
            }
        ).catch(() => {}).then(
             async e => {
                a = await e.json();
            }
        )
        return await Promise.resolve(a);
    }
    setActivePanel(panel){
        this.setState({activePanel: panel});
    }
    setActiveModal(modal, data){
        this.setState({activeModal: modal, activeStock: data});
    }
    setActiveView(view, data){
        let a = {activeView: view}
        for(const v of Object.keys(data)){
            a[v] = data[v]
        }
        this.setState(a);
    }
    dealComplete(type, count, price, ticker){
        this.setState({snackBar:
                <Snackbar
                    onClose={() => this.setState({ snackBar: null })}
                    before={<Avatar size={24} style={{ background: 'var(--accent)' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                >
                    {`${type === 'buy' ? `Покупка` : `Продажа`} ${ticker} ${count} шт. по цене ${price}`}
                </Snackbar>
        });
    }
    changeMarginStatus(){
        if(this.userValue().rubValueNaked > 0){
            this.setState({
                snackBar: <Snackbar
                    onClose={() => this.setState({snackBar: null})}
                    before={<Icon16ErrorCircleFill width={24} height={24} />}
                >
                    Сначала закройте непокрытые позиции
                </Snackbar>
            })
            return
        }
        fs.collection('users').doc(this.state.vk_user_id).update({
            marginable: !this.state.marginable
        });
    }
    async refresh(){
        this.setState({fetching: true})
        await this.getCurrencyData();
        await this.getCommodities();
        if(!this.state.AlpacaConnected){
            await fs.collection('users').doc(this.state.vk_user_id).get().then(
                e => {
                    this.portfolioInit(e.data().portfolio).then(v =>
                        this.setState({
                            portfolio: v
                        })
                    );
                }
            );
            await fs.collection('users').doc('-1').get().then(
                async e => {
                    this.pushStock(e.data().thisweek).then(v => {
                        this.setState({
                            stocksMarket: v
                        })
                    });
                }
            );
        }
        else{
            this.setState({
                snackBar: <Snackbar
                    onClose={() => this.setState({snackBar: null})}
                    before={<Icon20CheckCircleFillGreen width={24} height={24} />}
                >
                    Данные уже обновляются в реальном времени
                </Snackbar>
            })
        }
        this.setState({fetching: false});
    }
    openAnal(){
        this.setActiveModal('analytics', null);
    }
    render() {
        const {platform} = this.props;
        return <ConfigProvider platform={platform} scheme={this.state.scheme}>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout modal={
                        <Modal
                            vkuid={this.state.vk_user_id}
                            v={this.state.activeModal}
                            s={this.setActiveModal}
                            t={this.state.activeStock}
                            c={this.state.cash}
                            p={this.state.portfolio}
                            d={this.dealComplete}
                            q={this.state.currencies}
                            m={this.state.isMarketOpen}
                            u={this.userValue()}
                            e={this.state.marginable}
                            h={this.state.deals}
                            g={this.state.commodities}
                            scheme={this.state.scheme}
                        />
                    }>
                        <Root activeView={this.state.activeView}>
                            <View id={'profile'} activePanel={'profile'}>
                                <Panel id={'profile'}>
                                    <ProfilePanel
                                        back={() => this.setActiveView('main', {observerProfile: null})}
                                        token={this.state.access_token}
                                        vkuid={this.state.observerProfile}
                                        isObserver={true}
                                        observerGain={this.state.observerGain}
                                        observerPlace={this.state.observerRating}
                                    />
                                </Panel>
                            </View>
                            <View id={'main'} activePanel={this.state.activePanel}>
                                <Panel id={"portfolio"}>
                                    <PullToRefresh onRefresh={this.refresh} isFetching={this.state.fetching}>
                                        <BalanceCards
                                            exchangeRates={this.state.currencies}
                                            portfolio={this.state.portfolio}
                                            cash={this.state.cash}
                                            userValue={this.userValue()}
                                        />
                                        <ErrorBlock e={this.state.errors}/>
                                        <MarginCards
                                            u={this.userValue()}
                                            m={this.changeMarginStatus}
                                            e={this.state.marginable}
                                        />
                                        <OperationCards
                                            od={this.openDeals}
                                            l={this.state.bonusLoading}
                                            tdb={this.takeDailyBonus}
                                            oa={this.openAnal}
                                            b={this.state.lastBonusTaken}/>
                                        <StockGroup
                                            isPortfolio={true}
                                            portfolio={this.state.portfolio}
                                            stocksMarket={this.state.stocksMarket}
                                            setActiveModal={this.setActiveModal}
                                            setActivePanel={this.setActivePanel}
                                            loading={this.state.loading}
                                        />
                                        <CurrenciesGroup
                                            s={this.setActiveModal}
                                            cash={this.state.cash}
                                            rates={this.state.currencies}
                                            p={true}
                                        />
                                        <CommoditiesGroup
                                            s={this.setActiveModal}
                                            commodities={this.state.commoditiesAvailable}
                                            now={this.state.commoditiesAvailableNow}
                                            portfolio={this.state.commodities}
                                            p={true}
                                        />
                                    </PullToRefresh>
                                    <div style={{height: 48}}/>
                                </Panel>
                                <Panel id={"quotes"}>
                                    <PullToRefresh onRefresh={this.refresh} isFetching={this.state.fetching}>
                                        <MarketBlock m={this.state.isMarketOpen}/>
                                        <CurrenciesGroup
                                            s={this.setActiveModal}
                                            cash={this.state.cash}
                                            rates={this.state.currencies}
                                            p={false}
                                        />
                                        <StockGroup
                                            isPortfolio={false}
                                            portfolio={this.state.portfolio}
                                            stocksMarket={this.state.stocksMarket}
                                            setActiveModal={this.setActiveModal}
                                            setActivePanel={this.setActivePanel}
                                            loading={this.state.loading}
                                        />
                                        <CommoditiesGroup
                                            s={this.setActiveModal}
                                            now={this.state.commoditiesAvailableNow}
                                            commodities={this.state.commoditiesAvailable}
                                            portfolio={this.state.commodities}
                                            p={false}
                                        />
                                        <Group header={<Header mode={"secondary"}>на следующей неделе</Header>}>
                                            <CardScroll>
                                                {
                                                    this.state.stocksAvailableNextWeek.map((v,i) => {
                                                        return <StockCardHorizontal key={'horizontalcard'+i} v={v}/>
                                                    })
                                                }
                                            </CardScroll>
                                        </Group>
                                    </PullToRefresh>
                                    <div style={{height: 48}}/>
                                </Panel>
                                <Panel id={"rating"}>
                                    <RatingPanel
                                        token={this.state.access_token}
                                        vkuid={this.state.vk_user_id}
                                        tier={this.state.tier}
                                        openProfile={this.setActiveView}
                                    />
                                    <div style={{height: 48}}/>
                                </Panel>
                                <Panel id={"profile"}>
                                    <ProfilePanel
                                        token={this.state.access_token}
                                        vkuid={this.state.vk_user_id}
                                        settings={{
                                            publicProfile: this.state.publicProfile,
                                            isRatingParticipant: this.state.isRatingParticipant
                                        }}
                                    />
                                    <div style={{height: 48}}/>
                                </Panel>
                            </View>
                        </Root>
                    </SplitLayout>
                    <FixedLayout>
                        {this.state.snackBar}
                        <Epic style={this.state.activeView === 'profile' ? {display: 'none'} : {}} activeStory={this.state.activePanel} tabbar={
                            <Tabbar>
                                <TabbarItem selected={this.state.activePanel === "portfolio"} id={"portfolio"} onClick={() => this.setActivePanel("portfolio")} text={"Портфель"}>
                                    <Icon24WorkOutline/>
                                </TabbarItem>
                                <TabbarItem selected={this.state.activePanel === "quotes"} id={"quotes"} onClick={() => this.setActivePanel("quotes")} text={"Маркет"}>
                                    <Icon24SartOutline/>
                                </TabbarItem>
                                <TabbarItem selected={this.state.activePanel === "rating"} id={"rating"} onClick={() => this.setActivePanel("rating")} text={"Рейтинг"}>
                                    <Icon24CupOutline/>
                                </TabbarItem>
                                <TabbarItem selected={this.state.activePanel === "profile"} id={"profile"} onClick={() => this.setActivePanel("profile")} text={"Профиль"}>
                                    <Icon24UserOutline/>
                                </TabbarItem>
                            </Tabbar>
                        }/>
                    </FixedLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    }
}

withPlatform(App);

export default App;
