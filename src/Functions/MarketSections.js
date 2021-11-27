import MarketHours from "./MarketHours";

const MarketSections = () => {
    let now = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 - 1000 * 5 * 60 * 60);
    let pre = new Date(now.getTime());
    let open = new Date(now.getTime());
    let post = new Date(now.getTime());
    let close = new Date(now.getTime());
    const MH = MarketHours;
    pre.setHours(MH.pre.open[0]);
    pre.setMinutes(MH.pre.open[1]);
    pre.setSeconds(0);
    open.setHours(MH.open.open[0]);
    open.setMinutes(MH.open.open[1]);
    open.setSeconds(0);
    post.setHours(MH.post.open[0]);
    post.setMinutes(MH.post.open[1]);
    post.setSeconds(0);
    close.setHours(MH.post.close[0]);
    close.setMinutes(MH.post.close[1]);
    close.setSeconds(0);
    let nowSect;
    let nowProg;
    if(now.getTime() > pre.getTime() && now.getTime() <= open.getTime()){
        nowSect = 'pre';
        nowProg =  (now.getTime() - pre.getTime()) / (open.getTime() - pre.getTime());
    }
    if(now.getTime() > open.getTime() && now.getTime() <= post.getTime()){
        nowSect = 'open';
        nowProg =  (now.getTime() - open.getTime()) / (post.getTime() - open.getTime());
    }
    if(now.getTime() > post.getTime() && now.getTime() <= close.getTime()){
       nowSect = 'post';
        nowProg =  (now.getTime() - post.getTime()) / (close.getTime() - post.getTime());
    }
    if(now.getTime() > close.getTime()){
        nowSect = 'close2';
        let cl1 = new Date(now.getTime());
        cl1.setHours(23);
        cl1.setMinutes(59);
        cl1.setSeconds(59);
        nowProg =  (cl1.getTime() - now.getTime()) / (cl1.getTime() - post.getTime());
    }
    if(now.getTime() <= pre.getTime()){
        nowSect = 'close1';
        let cl1 = new Date(now.getTime());
        cl1.setHours(0);
        cl1.setMinutes(0);
        cl1.setSeconds(0);
        nowProg = (now.getTime() - cl1.getTime()) / (pre.getTime() - cl1.getTime());
    }

    let values = {
        close1: 0,
        pre: 0,
        open: 0,
        post: 0,
        close2: 0
    };
    let toFill = [];
    for(const v of Object.keys(values)){
        if(v !== nowSect){
            toFill.push(v);
        }
        else{
            for(let i = 0; i < toFill.length; i++){
                values[toFill[i]] = 100;
            }
            values[nowSect] = nowProg * 100;
            break;
        }
    }
    return {
        pre: pre,
        open: open,
        post: post,
        close: close,
        now: nowSect,
        progress: values
    }
}

export default MarketSections;