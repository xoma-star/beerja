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
    Header, Avatar, withPlatform, Placeholder, Button, FixedLayout, HorizontalCell
} from "@vkontakte/vkui";
import {Icon24CupOutline, Icon24SartOutline, Icon24WorkOutline, Icon56GestureOutline} from '@vkontakte/icons';
import BalanceCards from "./Components/BalanceCards";
import fs from "./Functions/Firebase.js";
import StockCard from "./Components/StockCard";
import StocksData from "./Functions/StocksData.js";
import Modal from "./Components/Modal";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'portfolio',
            userPortfolio: [],
            stockPrices: [],
            avgPrices: [],
            sharesCount: [],
            currencies: {
                rub: 1,
                usd: 72.44,
                eur: 81.12
            },
            stocksMarket: [],
            modal: null
        }
        this.api_key = 'CKB1ZOZN09CF26RO6LPJ';
        this.api_secret = 'cBuWsqBlsuB5aAf8c0qqHrL9jy5SWqX3kY9e6Qao';
        this.getPrice = this.getPrice.bind(this);
        this.getUserStocks = this.getUserStocks.bind(this);
        this.setActiveModal = this.setActiveModal.bind(this);
    }
    async componentDidMount() {
        await this.getUserStocks().then(e => {
            this.portfolioInit(e).then(a => {
                this.setState(a);
            });
        });
        const possible = ['ADBE', 'GOOG', 'AXP', 'AMZN', 'BLK', 'AAPL', 'KO', 'GRMN', 'INTC', 'MSFT'];
        for(const v of possible){
            await this.pushStock(v);
        }
        this.connectAlpacaWSS();
    }
    async getUserStocks(){
        let a;
        await fs.collection('users').doc('1').get().then(e => a=e.data().portfolio);
        return await Promise.resolve(a);
    }

    connectAlpacaWSS(){
        const ws = new WebSocket('wss://stream.data.sandbox.alpaca.markets/v2/iex');
        ws.onopen = () => {
          ws.send('{"action":"auth","key":"CKB1ZOZN09CF26RO6LPJ","secret":"cBuWsqBlsuB5aAf8c0qqHrL9jy5SWqX3kY9e6Qao"}')
        };
        ws.onmessage = (e) => {
          let a = JSON.parse(e.data)[0];
          if(a.msg === 'authenticated'){
            ws.send('{"action":"subscribe","trades":["AAPL","AMD"]}');
          }
          if(a.T === 't'){
              this.stockPriceUpdate(a.S, a.p);
          }
        }
    }

    stockPriceUpdate(t,v,c = true) {
        let a = this.state.avgPrices;
        if(c){
            a = this.state.stockPrices;
        }
        let i = this.state.userPortfolio.indexOf(t);
        a[i] = v;
        this.setState(a ? {stockPrices: a} : {avgPrices: a});
    }

    async portfolioInit(stocks){
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        for (const v of stocks) {
            a.push(v.ticker);
            b.push(v.avgPrice);
            c.push(v.count);
            await this.getPrice(v.ticker).then(e => d.push(e.trade.p));
        }
        return {
             userPortfolio: a,
             avgPrices: b,
             sharesCount: c,
             stockPrices: d
         };
    }

    async pushStock(t){
        let a = this.state.stocksMarket;
        for(const v of a){
            if(v.ticker === t){
                return false;
            }
        }
        this.getPrice(t).then(async e => {
            let s = await this.getPrice(t, e.trade.t);
            // for(const x of s.quotes){
            //     if(x.ap > 0){
            //         s = x.ap;
            //         break;
            //     }
            // }
            a.push({
                ticker: t,
                name: StocksData[t].name,
                price: e.trade.p,
                priceBefore: s.trades[0].p
            });
        })
        this.setState({stocksMarket: a});
        console.log(this.state);
    }


    async getPrice(ticker, date=null){
        let a;
        let u = 'https://data.sandbox.alpaca.markets/v2/stocks/'+ticker+'/trades/latest';
        if(date !== null){
            u = 'https://data.sandbox.alpaca.markets/v2/stocks/'+ticker+'/trades?limit=10&start='+(new Date(Date.parse(date) - 1000*24*60*60).toISOString())
        }
        await fetch(
            u,//?start='+(new Date(Date.now() - 1000*15*60).toISOString()),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'Basic ' + window.btoa(this.api_key+':'+this.api_secret)
                }
            }
        ).catch(() => {}).then(
             (e) => {
                a = e.json();
            }
        )
        return await Promise.resolve(a);
    }

    setActivePanel(panel){
        this.setState({activePanel: panel});
    }
    setActiveModal(modal, data){
        this.setState({activeModal: modal, activeTicker: data});
    }
    render() {
        const {platform} = this.props;
        return <ConfigProvider platform={platform} scheme={"bright_light"}>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout modal={
                            <Modal v={this.state.activeModal} s={this.setActiveModal} t={this.state.activeTicker}/>
                    }>
                        <View activePanel={this.state.activePanel}>
                            <Panel id={"portfolio"}>
                                <BalanceCards c={this.state.currencies}/>
                                <Group
                                    header={<Header mode={"secondary"}>Бумаги</Header>}
                                >
                                    {this.state.stockPrices.length > 0 ?
                                        this.state.userPortfolio.map((v,i) => {
                                            let a = this.state.avgPrices[i];
                                            let b = this.state.sharesCount[i];
                                            let c = this.state.stockPrices[i];
                                        return (
                                            <StockCard key={c+v} a={a} b={b} c={c} v={v} p={true} s={this.setActiveModal}/>
                                        )
                                    }) :
                                        <Placeholder
                                            icon={<Icon56GestureOutline/>}
                                            header={<Header>Здесь пока пусто</Header>}
                                            action={<Button onClick={() => this.setActivePanel("quotes")} size={"m"}>К покупкам</Button>}
                                        />
                                    }
                                </Group>
                            </Panel>
                            <Panel id={"quotes"}>
                                <Group
                                    header={<Header mode={"secondary"}>Доступно</Header>}
                                >
                                    {
                                        this.state.stocksMarket.map((v,i) => {
                                            return <StockCard key={v.price+v.ticker} a={v.priceBefore} b={0} c={v.price} v={v.ticker} p={false}/>
                                        })
                                    }
                                </Group>
                                <Group header={<Header mode={"secondary"}>на следующей неделе</Header>}>
                                    <CardScroll>
                                        {
                                            this.state.stocksMarket.map((v,i) => {
                                                return <HorizontalCell>
                                                    <Avatar size={64} src={require(`./Logos/${StocksData[v.ticker].logo}`).default}/>
                                                </HorizontalCell>
                                            })
                                        }
                                    </CardScroll>
                                </Group>
                            </Panel>
                            <Panel id={"rating"}>

                            </Panel>
                        </View>
                    </SplitLayout>
                    <FixedLayout>
                        <Epic activeStory={this.state.activePanel} tabbar={
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
                            </Tabbar>
                        }/>
                    </FixedLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    }
}

// const App = () => {
//     const platform = usePlatform();
//     fetch(
//         'https://data.sandbox.alpaca.markets/v2/stocks/AAPL/quotes/latest',//?start='+(new Date(Date.now() - 1000*15*60).toISOString()),
//         {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Authorization': 'Basic ' + window.btoa(api_key+':'+api_secret)
//             }
//         }
//     ).catch(() => {}).then(
//         (e) => {
//             //s
//         }
//     )
//     const [activePanel, setActivePanel] = useState("portfolio");
//     const
//
// }

withPlatform(App);

export default App;
