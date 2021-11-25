import React from "react";
import {Spinner} from "@vkontakte/vkui";
import './Charts.css'

class SmallChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true}
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
    componentDidMount() {
        let ticker = this.props.ticker;
        if(this.props.currency){ticker = this.getCurrencyTicker(ticker)}
        const script = document.createElement('script');
        script.addEventListener('load', () => setTimeout(() => this.setState({loading: false}), 0));
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
        script.async = true;
        script.innerHTML = JSON.stringify(
            {
            "symbol": ticker,
            "width": '100%',
            "height": 220,
            "locale": "ru",
            "dateRange": "12M",
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
        return <div style={{height: 220}}>
            <Spinner style={!this.state.loading ? {display: 'none'} : {}}/>
            <div className="tradingview-widget-container" ref={this._ref}>
                <div style={this.state.loading ? {display: 'none'} : {}} className="tradingview-widget-container__widget"/>
            </div>
        </div>
    }
}

export default SmallChart;