const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Interview, Faq, Category, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");
//미들웨어 모든 항목에 추가 필요


router.get('/interview', async(req,res)=>{ 
    try{ // 이 부분 페이지네이션하고 번호 등등 만들기
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];
        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;')

        let allinterview = await sequelize.query('select * from interview;')
        let ifEmpty;
        if(allinterview[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from interview;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

        let results = await sequelize.query(`select a.id, a.username, a.content, curr_id, a.\`show\`, curriculum.subject from interview as a left join curriculum on a.curr_id=curriculum.id order by id desc limit 3 offset ${offset};`)
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

                res.render('../views/admin/interview_list.html',{ 
                    interviewList:result[0], //이거바꾸기
                    totalinterview:allinterview[0],  //이거바꾸기
                    searchPages:page_array,
                    ifEmpty,
                    totalCurr:allCurr[0],
                });
        })
    } catch(e){console.log(e)}
})

//삭제된 게시물 접근 거부
async function authDelAdmin(req,res,next){ 
    let getthat = await Interview.findOne(
        // {attributes:['ifdeleted']},
        {where:{id:req.query.id}
    })

    if(getthat.dataValues.ifdeleted==null){
        next();
    }
    else{
        console.log('deleted DB')
        let adminDelAuth = {
            msg: '삭제된 게시물입니다.', 
            move: 'http://localhost:3000/admin/Interview/'
        }
        res.render('../views/logincheck.html',{ adminDelAuth })
        return;
    }
}

router.get('/interview/view', authDelAdmin, async(req,res)=>{

    try{
        let results = await sequelize.query(`select a.id, curr_id, curriculum.subject, a.username, a.content, a.\`show\` from interview as a left join curriculum on a.curr_id=curriculum.id where a.id=${req.query.id}`)
        .then((result) => {
            res.render('../views/admin/interview_view.html',{ 
                interviewList:result[0],
            });
        })
    } catch(e){console.log(e)}

})


router.get('/interview/search', async(req,res)=>{
    try{
        let allinterview = await sequelize.query('select * from interview;')
        let ifEmpty;
        if(allinterview[0].length==0){
            ifEmpty = true;
        }
        console.log('req.query : ',req.query);
        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;')
        
        // 쿼리문 직접 추출
        let bodyComb = 'and '; 
        let {curr_id, username, show} = req.query;

        console.log('curr_id : ',curr_id);
        console.log('username : ',username);
        console.log('show : ',show);

        if(curr_id.length>0){
            bodyComb += `curr_id = '${curr_id}' and `
        }
        if(username != ''){
            bodyComb += `username like '%${username}%' and `
        }
        if(show.length>0){
            bodyComb += `a.\`show\` = ${show} and `
        }

        console.log('bodyComb : ',bodyComb);
        console.log('bodyComb.length : ',bodyComb.length);
        console.log('bodyComb.substr : ',bodyComb.substr());
        console.log('최종 : ',bodyComb.substr(3,bodyComb.length-7));

        let sql = ( bodyComb == 'and ') ? '' : `where ${bodyComb.substr(3,bodyComb.length-7)}` ;
        
        console.log('sql : ',sql);
        
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        let resultsall = await sequelize.query(`select * from interview ${sql};`)
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
        
        let currCurr = await Curriculum.findOne({
            attributes:['id','subject'],
            where:{id:curr_id}
        })

        // 검색
        let results = await sequelize.query(`select a.id, a.username, a.content, curr_id, a.\`show\`, curriculum.subject from interview as a left join curriculum on a.curr_id=curriculum.id ${sql} order by id desc limit 3 offset ${offset};`)
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
                res.render('../views/admin/interview_list.html',{ 
                    ifEmpty,
                    interviewList:result[0],
                    totalinterview:allinterview[0],
                    searchPages:page_array,
                    searchCurr:allCurr[0],
                    page, curr_id, username, show,
                });
            })

    } catch(e){console.log(e)}
})


router.get('/interview/add', async(req,res)=>{
    try{
        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;')

        res.render('../views/admin/interview_write.html',{
            totalCurr:allCurr[0],
        })
    }
    catch(e){
        console.log(e)
    }
})

router.post('/interview/add_success', async(req,res)=>{ 
    try{
        let {username, content, curr_id, show} = req.body;
        
        console.log('req.body : ',req.body);
        console.log('add create 접근중');

        let result = await Interview.create({
            username, content, curr_id, show
        })

        console.log('add create 접근완료');

        res.redirect('/admin/interview');
    }
    catch(e){
        console.log(e);
    }
})

router.get('/interview/modify', async(req,res)=>{
    try{
        console.log('interview_modify 접근중');

        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;');
        let results = await sequelize.query(`select a.id, curr_id, curriculum.subject, a.username, a.content, a.\`show\` from interview as a left join curriculum on a.curr_id=curriculum.id where a.id=${req.query.id}`)
        .then((result) => {
            console.log('results[0] : ',result[0]);
            res.render('../views/admin/interview_modify.html',{ 
                interviewList:result[0],
                totalCurr:allCurr[0],
            });
        })
    } catch(e){
        console.log(e);
    }
})

router.post('/interview/modify_success', async(req,res)=>{
    try{ 
        console.log('asd')
        let {curr_id, username, content, show, boardid} = req.body
        console.log('req.body : ',req.body)
        console.log('curr_id : ',curr_id);
        console.log('boardid : ',boardid);
        
        let result = await Interview.update({
            curr_id, username, content, show,
            },
            {where:{
                id:boardid,
            }
        })

        res.redirect(`/admin/interview/view?id=${boardid}`)
        console.log(result)
    } catch(e){console.log(e)}
})

router.get('/interview/delete', async(req,res)=>{
    console.log('get delete 접근중');

    try{
        let id = req.query.id;
        await Interview.destroy({
            where:{id:id}
    })
        res.redirect('/admin/interview');
    } catch(error){console.log(error)}
})

router.post('/interview/delete', async (req,res)=>{
    console.log('post delete 접근중');

    try{ 
        let selDelItems = req.body.selDelItems
        console.log(selDelItems)

        let deletedAt = Interview.destroy({
            where:{id:selDelItems}
        })

        res.redirect('/admin/interview')

    } catch(e){
            console.log(e)
      };
})

module.exports = router;