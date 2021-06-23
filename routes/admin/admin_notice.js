const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Category, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");
//미들웨어 모든 항목에 추가 필요


router.get('/notice', async(req,res)=>{ 
    try{ // 이 부분 페이지네이션하고 번호 등등 만들기
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        let allnotice = await sequelize.query('select * from notice;')
        let ifEmpty;
        if(allnotice[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from notice;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

        let results = await sequelize.query(`select id, title, content, date_format(registereddate, '%Y-%m-%d') as registereddate, hit, \`show\` from notice order by id desc limit 3 offset ${offset};`)
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

                res.render('../views/admin/notice_list.html',{ 
                    noticeList:result[0], //이거바꾸기
                    totalnotice:allnotice[0],  //이거바꾸기
                    searchPages:page_array,
                    ifEmpty,
                });
        })
    } catch(e){console.log(e)}
})

//삭제된 게시물 접근 거부
async function authDelAdmin(req,res,next){ 
    let getthat = await Notice.findOne(
        // {attributes:['ifdeleted']},
        {where:{id:req.query.id}}
        )
    if(getthat.dataValues.ifdeleted==null){
        next();
    }
    else{
        console.log('deleted DB')
        let adminDelAuth = {
            msg: '삭제된 게시물입니다.', 
            move: 'http://localhost:3000/admin/notice/'
        }
        res.render('../views/logincheck.html',{ adminDelAuth })
        return;
    }
}

router.get('/notice/view', authDelAdmin, async(req,res)=>{

    try{
        let result = await Notice.findOne({
            where:{id:req.query.id}
        }); 
        
        res.render('./admin/notice_view.html',{
            result,
 
        });
    } catch(e){console.log(e)}

})


router.get('/notice/search', async(req,res)=>{
    try{
        console.log('search 접근중');

        let allnotice = await sequelize.query('select * from notice;')
        let ifEmpty;
        if(allnotice[0].length==0){
            ifEmpty = true;
        }
        
        console.log('req.query : ',req.query);
        
        // 쿼리문 직접 추출
        let bodyComb = 'and '; 
        let {title, show, start_date, end_date} = req.query;

        console.log('title : ',title);
        console.log('show : ',show);
        console.log('start_date : ',start_date);
        console.log('end_date : ',end_date);

        if(title.length>0){
            bodyComb += `title like '%${title}%' and `
        }
        if(show.length>0){
            bodyComb += `\`show\` = ${show} and `
        }
        if(start_date.length>0){
            bodyComb += `registereddate > '${start_date}' and `
        }
        if(end_date.length>0){
            bodyComb += `registereddate < '${end_date}' and `
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

        let resultsall = await sequelize.query(`select * from notice ${sql};`)
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
        
        // 검색
        let results = await sequelize.query(`select id, title, content, date_format(registereddate, '%Y-%m-%d') as registereddate, \`show\` from notice ${sql} order by id desc limit 3 offset ${offset};`)
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
                res.render('../views/admin/notice_list.html',{ 
                    ifEmpty,
                    noticeList:result[0],
                    totalnotice:allnotice[0],
                    searchPages:page_array,
                    title, page, start_date, end_date, show,
                });
            })

    } catch(e){console.log(e)}
})


router.get('/notice/add', async(req,res)=>{
    try{
        res.render('../views/admin/notice_write.html')
        } catch(e){console.log(e)}
})

router.post('/notice/add_success', async(req,res)=>{ 
    try{
        console.log('add_succuess 접근중');

        let {title, content, show} = req.body 
        
        console.log('req.body : ',req.body);
        console.log('title : ',title);
        console.log('content : ',content);
        console.log('show : ',show);

        let result = await Notice.create({
            title, content, show
        })

        res.redirect('/admin/notice')
    }
    catch(e){
        console.log(e);
    }
})

router.get('/notice/modify', async(req,res)=>{
    try{
        let result = await Notice.findOne({
            where:{id:req.query.id}
        })

        res.render('../views/admin/notice_modify.html',{ //페이지명 변경 필요
            result, //뿌릴 이름 변경
            boardid:req.query.id,
        })
    } catch(e){console.log(e)}
})

router.post('/notice/modify_success', async(req,res)=>{
    try{ 
        console.log('modify_success 접근중');

        let {title, content, show, boardid} = req.body;
        
        console.log('req.body : ',req.body);
        console.log('boardid : ',boardid);

        let result = await Notice.update({
            title, content, show,
            },
            {where:{
                id:boardid
            }
        })
        res.redirect(`/admin/notice/view?id=${boardid}`)
        console.log(result)
    }
    catch(e){
        console.log(e);
    }
})

router.get('/notice/delete', async(req,res)=>{
    try{
        let id = req.query.id;
        await Notice.destroy({
            where:{id:id}
    })
        res.redirect('/admin/notice');
    } catch(error){console.log(error)}
})

router.post('/notice/delete',async (req,res)=>{
    try{ 
        let selDelItems = req.body.selDelItems
        console.log(selDelItems)

        let deletedAt = Notice.destroy({
            where:{id:selDelItems}
        })

        res.redirect('/admin/notice')

    } catch(e){
            console.log(e)
      };
})

module.exports = router;
