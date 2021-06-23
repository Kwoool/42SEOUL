const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser'); //흠//
const createToken = require('../../jwt');
const createHash = require('../../chash');
const crypto = require('crypto');

const {sequelize, User} = require('../../models/index')


router.get('/',async (req,res)=>{

    res.render('main.html');
});

router.post('/auth/local/login', async(req,res)=>{

    let {userid,userpw} = req.body
    console.log(req.body)
    let result = {}
    let token = createHash(userpw)
    console.log(token)
    let check = await User.findOne({
        where: {
            userid:userid,
            userpw:token,}
    })
    let token2 = createToken(userid)

    if(check == null){
        result = {
            result:false,
            msg: 'check the id or the password',
        }
        console.log('nope')
    } else{
        result = {
            result:true,
            msg:'signed in successfully',
            id:userid
        }
        console.log('yes')
        res.cookie('AccessToken',token2,{httpOnly:true, secure:true})
    }
    res.json(result)
})

module.exports = router;