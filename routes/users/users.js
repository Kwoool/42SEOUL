const express = require('express');
const crypto = require('crypto');
const {sequelize, User} = require('../../models/index')
const cookieParser = require('cookie-parser'); //흠//
const createToken = require('../../jwt');
const createHash = require('../../chash');
const router = express.Router();

router.get('/join_terms',(req,res)=>{
    console.log('join_term 접근중');

    res.render('../views/join_terms.html');
})

router.get('/join_signup',(req,res)=>{
    console.log('join_signup 접근중');

    res.render('../views/join_signup.html');
})

router.post('/join_success',async (req,res)=>{
    console.log('join_success 접근중');

    let {userid,username,gender,userphone,useremail} = req.body
    let userpw = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                      .update(req.body.userpw)
                      .digest('base64')
                      .replace('=','')
                      .replace('==','')

    let token = createHash(req.body.userpw)

    let result = await User.create({
        userid,userpw,username,gender,userphone,useremail
    }).catch(e=>{
        console.log(e.errors[0].message)
        
    })
    res.render('../views/join_complete.html',{
        userid, username,
    });
})

router.get('/check', async (req,res)=>{
    console.log('check 접근중');
    userid = req.query.userid
    result = await User.findOne({
        where:{userid}
    })
    console.log(req.query)
    if (result == undefined){
        check = true;
    } else{
        check = false;
    }
    res.json({check})
})

module.exports = router;