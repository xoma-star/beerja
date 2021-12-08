import React from "react";
import {Button, Card, CardScroll, FormItem, Spinner} from "@vkontakte/vkui";
import './Charts.css'

class SmallChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeTF: 'ДЕНЬ'}
        this.updateTF = this.updateTF.bind(this);
        this._ref = React.createRef();
    }
    getCurrencyTicker(ticker){
        switch (ticker){
            case 'RUBUSD':
                return 'USDRUB'
            case 'RUBCHF':
                return 'CHFRUB'
            case 'RUBGBP':
                return 'GBPRUB'
            case 'RUBEUR':
                return 'EURRUB'
            default:
                return ticker
        }
    }
    updateTF(){
        this.script = document.createElement('script');
        // this.script.addEventListener('load', () => setTimeout(() => this.setState({loading: false}), 0));
        // this.script.src = 'https://s3.tradingview.com/tv.js'
        // this.script.async = true;
        let ticker = this.props.ticker;
        // this.setState({activeTF: TF.target.innerText})
        if(this.props.currency){ticker = this.getCurrencyTicker(ticker)}
        const ranges = {
            '5': 'М5',
            '15': 'М15',
            '30': 'М30',
            '60': '1Ч',
            '240': '4Ч',
            'D': 'ДЕНЬ',
            'W': 'НЕДЕЛЯ',
            'M': 'МЕСЯЦ'
        };
        let dr;
        for(const k of Object.keys(ranges)){
            if(ranges[k] === this.state.activeTF){
                dr = k;
                break;
            }
        }
        this.script.innerHTML = 'new TradingView.widget(' + JSON.stringify(
            {
                "width": '100%',
                "height": 220,
                "symbol": ticker,
                "interval": dr,
                "timezone": "Etc/UTC",
                "theme": this.props.scheme === 'bright_light' ? 'light' : 'dark',
                "style": "1",
                "locale": "ru",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_top_toolbar": false,
                "hide_legend": true,
                "allow_symbol_change": true,
                "save_image": false,
                "container_id": "tradingview_519a8",
                "isTransparent": true
            }) + ');';
        document.getElementById('tradingview_519a8').innerHTML = '';
        this._ref.current.appendChild(this.script);
    }
    componentDidMount() {
        let ticker = this.props.ticker;
        if(this.props.currency){ticker = this.getCurrencyTicker(ticker)}
        const script = document.createElement('script');
        script.addEventListener('load', () => setTimeout(() => this.setState({loading: false}), 1000));
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
        script.async = true;
        script.innerHTML = JSON.stringify(
            {
                "symbol": ticker,
                "width": '100%',
                "height": 220,
                "locale": "ru",
                "dateRange": "3M",
                "colorTheme": this.props.scheme === 'bright_light' ? "light" : 'dark',
                "trendLineColor": "rgba(41, 98, 255, 1)",
                "underLineColor": "rgba(41, 98, 255, 0.3)",
                "underLineBottomColor": "rgba(41, 98, 255, 0)",
                "isTransparent": true,
                "autosize": false,
                "largeChartUrl": "#"
            })
        this._ref.current.appendChild(script);
    }
    render() {
        return <div>
            <div style={{height: 220}}>
                <Spinner style={!this.state.loading ? {display: 'none'} : {}}/>
                <div className="tradingview-widget-container" ref={this._ref}>
                    <div style={this.state.loading ? {display: 'none'} : {}} id="tradingview_519a8"/>
                </div>
            </div>
            <FormItem style={this.props.currency ? {display: 'none'} : {}}>
                <Button
                    style={{marginTop: 12}}
                    onClick={() => window.open('https://ru.tradingview.com/chart/?symbol='+this.props.ticker, '_blank')}
                    stretched
                    mode={'secondary'}
                >Подробный график</Button>
            </FormItem>
            <CardScroll style={{marginTop: 12, display: 'none'}}>
                {['М5', 'М15', 'М30', 'Ч1', 'Ч4', 'ДЕНЬ', 'НЕДЕЛЯ', 'МЕСЯЦ'].map(v => {
                    return <Card className={this.state.activeTF === v ? 'active' : ''} key={v} onClick={this.updateTF} style={{width: 'auto', padding: 8}}>{v}</Card>
                })}
            </CardScroll>
        </div>
    }
}

export default SmallChart;