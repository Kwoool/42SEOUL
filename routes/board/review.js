const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const {sequelize,Review,User, Curriculum} = require('../../models/index');
const createToken = require('../../jwt');
const createHash = require('../../chash');
const loginCheck = require('../../middleware/getcookie');
const getCookie = require('../../middleware/getcookie');

// const authWrite = require('../../middleware/review/authwrite');
// const authModify = require('../../middleware/review/authmodify');
// const authDel = require('../../middleware/review/authdel');

router.get('/',async (req,res)=>{
    try{
        let loadData = await sequelize.query('SELECT * FROM review where \`show\`=1;')
        
        console.log(loadData)
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        let allRev = await sequelize.query('select * from review where \`show\`=1;');
        let ifEmpty;
        if(allRev[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from review where \`show\`=1;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
        ;
        let results = await sequelize.query(`select id, title, userid, content, date_format(date, '%Y-%m-%d') as date, hit, curr_id, \`show\` from review order by id desc limit 3 offset ${offset};`)
            .then((result) => {

                let total_record = result[0].length;
                let total_page = Math.ceil(resultsall/3);
                
                for(i=1;i<=total_page;i++){
                    page_array.push(i);
                };
                result[0].forEach(ele => {
                    ele.num = resultsall - offset;
                    resultsall--;
                });

                res.render('../views/review/review_list.html',{
                    revList:result[0], 
                    totalRev:allRev[0], 
                    searchPages:page_array,
                    ifEmpty,
                });

    })
    } catch(e){console.log(e)}
})

router.get('/write', async (req,res)=>{
    try{
        //???????????? ???????????? usertype ??????
        let cookieString = req.headers.cookie;
        console.log('asd',cookieString)
        let signedinId = getCookie(cookieString)       
        //???????????? ???
        if(signedinId=='' || signedinId==undefined || signedinId==null){
            let selCurr = await Curriculum.findAll({
                attributes:['id','subject'],
            }) 
            res.render('../views/review/review_write.html',{
                selectedCurr:selCurr,
                signedinId
            })
            return;
        }
        //?????? ??? ?????????
        else{
            let userStat = await User.findOne({
                attributes:['id', 'usertype']
                , where:{
                    userid:signedinId
                }
            })
            console.log(userStat)
            let userAuth = userStat.dataValues.usertype
            //???????????? ??????
            if(userAuth == 2){
                let selCurr = await Curriculum.findAll({
                    attributes:['id','subject'],
                }) 
                res.render('../views/review/review_write.html',{
                    selectedCurr:selCurr,
                    userAuth,
                    signedinId
                })
                return;
            } else{
                let selectedCurr = [];
                let userCurr = await User.findOne({
                    attributes:['userclass'],
                    where:{
                        userid:signedinId
                    }
                })
                let userClass = userCurr.dataValues.userclass

                //???????????? ??????????????? ????????????x (????????? ??????)
                if(userClass==null || userClass==undefined){
                    let reviewAuth = {
                        msg: '????????? ????????? ??? ?????? ?????? ????????? ????????????.',
                        move: 'http://localhost:3000/review'
                    }
                    res.render('../views/logincheck.html',{reviewAuth})
                    return;
                } else{ // ?????? ??? ???????????? ??????
                    console.log('?????????')
                    let currArr = userClass.split(' ')
                    for(let i=0; i<currArr.length;i++){
                        let [selCurr] = await Curriculum.findAll({
                            attributes:['id','subject'],
                            where:{
                                id:currArr[i]
                            }
                        }) 
                        selectedCurr.push(selCurr.dataValues)
                    }
                    res.render('../views/review/review_write.html',{
                        selectedCurr:selectedCurr,
                        signedinId
                    })
                } 
            }
        }
    } catch(e){console.log(e)}
})

router.post('/write_success',async (req,res)=>{
    try{
        let cookieString = req.headers.cookie;
        let signedinId = getCookie(cookieString)

        let {title, userid, content, curr_id} = req.body; // ????????? ???????????? ???


        function pwCreate(password){
            let pw = crypto.createHmac('sha256',Buffer.from(process.env.salt))
            .update(password)
            .digest('base64')
            .replace('=','')
            .replace('==','')
            return pw;
        }
        //???????????? ?????? ????????? ?????? ?????????, ????????? ????????? ???????????? ??????
        let emptyChk = (req.body.postpw==undefined) ? '' : req.body.postpw 
        let postpw = (emptyChk=='') ? '' : pwCreate(emptyChk)

        let result = await Review.create({
            title, userid, content, curr_id, postpw
        })
        res.redirect('/review')

    } catch(e){console.log(e)}
})

router.get('/view',async (req,res)=>{
    try{
        let cookieString = req.headers.cookie;
        let signedinId = getCookie(cookieString)
        //????????? ?????? ??????

        let result = await Review.findOne({
            where:{id:req.query.id}
        }); 
    
        let hit = result.dataValues.hit
            hit+=1;
        let addHit = await Review.update({
            hit:hit
        },{where:{id:req.query.id}})
        //view ????????? ????????? ??????

        function getDate(date){
            var year = date.getFullYear()
            var month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            var day = date.getDate();
            day = day >= 10 ? day : '0' + day; 
            return  year + '-' + month + '-' + day;
        }
        let registeredDate = getDate(result.dataValues.date)

        getCurrId = (result.dataValues.curr_id)
        // ??????????????? curr_id ??????
        let getSub = await Curriculum.findOne({
            attributes:['id','subject'],
            where:{
                id:getCurrId
            }
        }) 

        // ??????????????? ????????? ????????? ??????
        // ?????? ????????? ?????????
        res.render('./review/review_view.html',{
            result,
            getSub: getSub.dataValues.subject,
            signedinId
    });
    } catch(e){console.log(e)}
})
// ???????????? ??????



//???????????? ??????
async function authModify(req,res,next){
    let cookieString = req.headers.cookie;
    let loginStatus = loginCheck(cookieString);

    async function getUserStat(){
        if(loginStatus==undefined || loginStatus==null || loginStatus==''){
            return 0;

        } else{
            let result = await User.findOne({
                where:{userid:loginStatus}
            })
            return result.dataValues.usertype;
        }
    }

    let userStat = await getUserStat();
    if(userStat==2){
        console.log('?????????');
        next();
    } else{
        console.log(req.body)
        let eitherId = (req.query.id!==undefined) ? req.query.id : req.body.postid
        let getPost = await Review.findOne({
            attributes:['userid','postpw'],
            where:{
                id:req.query.id
            }
        })
        // console.log('??????',getPost)
        let getWriter = getPost.dataValues.userid;
        let getPw = getPost.dataValues.postpw;
        let postid = req.query.id;
        if(loginStatus == undefined && getPw == ''){
            console.log('???????????? ???????????? ??????')

            let reviewAuth = {
                result:false,
                msg: '???????????? ?????? ????????? ?????????.',
                move:'http://localhost:3000/review/'
            }
            res.render('../views/logincheck.html',{ reviewAuth });
            //????????? ??? ??????????
            return;
        } else if(loginStatus!==undefined && loginStatus!==getWriter){
            console.log('????????? ?????? ?????? ?????? ??????')
            console.log(req.query.id,postid,'????????????')
            let reviewAuth = {
                result:false,
                msg: '?????????????????? ?????? ????????? ????????????.',
                move:'http://localhost:3000/review/'
            }
            res.render('../views/logincheck.html',{ reviewAuth,  });
            return;
        } else if(loginStatus==undefined && getPw !==''){
            console.log('???????????? ????????? ?????? ??????')
            // console.log(req.query.id,'????????????')
            res.render('../views/review/review_pwchk.html',{postid})
            return;
        } else{
            console.log('????????? ?????? ?????? ?????? ??????')
            // console.log(req.query.id,'????????????')
        }
        next();
    }
}

router.post('/pwchk', async(req,res)=>{
    let userpw = req.body.userpw
    console.log(req.body)
    let result = {}
    let token = createHash(userpw)
    let check = await Review.findOne({
        where: {
            postpw:token,}
    })
    // let token2 = createToken(userid)

    if(check == null){
        result = {
            result:false,
        }
        console.log('nope')
    } else{
        result = {
            result:true,
        }
        console.log('yes')
    }
    res.json(result)
})

router.get('/modify',authModify,async(req,res)=>{
    try{
        let cookieString = req.headers.cookie;
        let signedinId = getCookie(cookieString)

        let result = await Review.findOne({
            where:{id:req.query.id}
        })

        res.render('./review/modify.html',{
            loadReview: [result],
            signedinId,
            boardid:req.query.id
        })
    } catch(e){console.log(e)}
})

router.post('/modify_success',async (req,res)=>{
    try{
        let {title, content, boardid} = req.body;
        let result = await Review.update({
                title,content, 
            },
            {where:{
                id:boardid,
            }
        })
            res.redirect('/review')
    } catch(e){console.log(e)}
})

async function authDel(req,res,next){
    let cookieString = req.headers.cookie;
    let loginStatus = loginCheck(cookieString);

    let getWriter = await Review.findOne({
        where:{
            id:req.query.id
        }
    })
    let writer = getWriter.dataValues.userid;

    if(loginStatus == undefined || loginStatus !== writer){

        let reviewAuth = {
            result:false,
            msg: 'Only the writer can delete.',
            move:'http://localhost:3000/review/'
        }
        res.render('../views/logincheck.html',{ reviewAuth })
        return; 
    }
    next();
}

router.get('/delete', authDel, async(req,res)=>{
    try{ 
        let id = req.query.id;
        console.log(id)
        let result = await Review.destroy({
            where:{id:id}
        })
        res.redirect('/review')
    } catch(e){console.log(e)}
})


module.exports = router;
