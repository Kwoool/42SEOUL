require('dotenv').config();
const loginCheck = require('./getcookie');


module.exports = (req,res,next)=>{
    let cookieString = req.headers.cookie;
    let loginStatus = loginCheck(cookieString);
    console.log('logginstatus', cookieString, loginStatus)
    if(loginStatus !== 'moderator'){ // 나중에 admin 쿠키값 찾아오기
        console.log('앗')
        let json = {
            result:false,
            msg: '관리자에게만 접근 권한이 있습니다.',
            move:'http://localhost:3000/'
        }
        res.render('../views/admincheck.html',{ json })
        return 
    } else{ console.log('올')}
    next();
}