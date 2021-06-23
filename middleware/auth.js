require('dotenv').config()
const crypto = require('crypto')

module.exports = (req,res,next)=>{
    let {AccessToken} = req.cookies;
    if(AccessToken == undefined){
        console.log('로그아웃 상태')
        res.json({
            result:false,
            msg: '먼저 로그인 하세요.'
        })
        return;
    }

    let [header,payload,sign] = AccessToken.split('.');
    let signature = getSignature(header,payload)

    if(sign != signature){
        console.log('invalid token');
        res.json({
            result:false,
            msg: '유효하지 않은 토큰입니다.'
        })
        return;
    }

    let {userid, exp} = JSON.parse(Buffer.from(payload,'base64').toString())

    let nexttime = new Date().getTime();
    if(nexttime>exp){
        console.log('token has expired');
        res.clearCookie('AccessToken');
        res.json({
            result:false,
            msg: '토큰이 만료되었습니다.'
        })
        return;
    }
    req.userid = userid;
    next();
}

function getSignature(header,payload){
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                                                       .update(header+"."+payload)
                                                       .digest('base64')
                                                       .replace('=','')
                                                       .replace('==','')
    return signature;
}