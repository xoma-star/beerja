const NewUserData = {
    balance: 500000,
    clearing: true,
    commodities: {},
    currencies: {
        chf: {
            avgPrice: 0,
            count: 0
        },
        eur: {
            avgPrice: 0,
            count: 0
        },
        gbp: {
            avgPrice: 0,
            count: 0
        },
        rub: {
            avgPrice: 1,
            count: 500000
        },
        usd: {
            avgPrice: 0,
            count: 0
        }
    },
    deals: [],
    lastBonusTaken: 0,
    lastValue: 500000,
    marginable: false,
    portfolio: [],
    publicProfile: true,
    tier: 'bronze',
    isNewUser: true,
    loginMessage: null
}

export default NewUserData