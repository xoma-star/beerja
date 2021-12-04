const RuFormat = (a) => {
    if(a) {
        return new Intl.NumberFormat('ru-RU').format(a.toFixed(2));
    }
    return 0
}

export default RuFormat