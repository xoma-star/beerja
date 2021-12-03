const qs = require('querystring');
const crypto = require('crypto');


const CheckSignature = (a) => {
    const urlParams = qs.parse(a.substr(1));
    const ordered = {};
    Object.keys(urlParams).sort().forEach((key) => {
        if (key.slice(0, 3) === 'vk_') {
            ordered[key] = urlParams[key];
        }
    });

    const stringParams = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', 'Y3v8xhZjQ7ZiT944hOxA')
        .update(stringParams)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');
    if(paramsHash === urlParams.sign) return urlParams.vk_user_id
    return 0
}

export default CheckSignature