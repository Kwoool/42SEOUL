const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
// const authDelAdmin = require('../../middleware/authdeladmin.js')
const { Op } = require("sequelize");
//미들웨어 모든 항목에 추가 필요

router.get('/curr', async(req,res)=>{ 
    try{ // 이 부분 페이지네이션하고 번호 등등 만들기
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];
        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;')
        let ifEmpty;
        if(allCurr[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from curriculum where ifdeleted is null;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

        let results = await sequelize.query(`select * from curriculum where ifdeleted is null order by id desc limit 3 offset ${offset};`)
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

                res.render('../views/admin/curriculum_list.html',{ 
                    currList:result[0],
                    totalCurr:allCurr[0],
                    searchPages:page_array,
                    ifEmpty
                });
        })
    } catch(e){console.log(e)}
})



//삭제된 게시물 접근 거부
async function authDelAdmin(req,res,next){ 
    let getthat = await Curriculum.findOne(
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
            move: 'http://localhost:3000/admin/curr/'
        }
        res.render('../views/logincheck.html',{ adminDelAuth })
        return;
    }
}

router.get('/curr/view', authDelAdmin, async(req,res)=>{

    try{
        let result = await Curriculum.findOne({
            where:{id:req.query.id}
        }); 
        
        let registeredDate = result.dataValues.registereddate
        let startDate = result.dataValues.start_date
        let endDate = result.dataValues.end_date
        console.log(result)
        res.render('./admin/curriculum_view.html',{
            result,
            startDate,
            endDate,
            registeredDate
        });
    } catch(e){console.log(e)}

})


router.get('/curr/search', async(req,res)=>{
    try{

        let allCurr = await sequelize.query('select * from curriculum where ifdeleted is null;')
        let ifEmpty;
        if(allCurr[0].length==0){
            ifEmpty = true;
        }

                // 쿼리문 직접 추출
        let bodyComb = 'and ';
        let {srcid, start_date, end_date, content, recruit, show} = req.query
        console.log(srcid)
        if(srcid.length>0){
            bodyComb += `id = ${srcid} and `
        }
        if(start_date.length>0){
            bodyComb += `start_date > '${start_date}' and `
        }
        if(end_date.length>0){
            bodyComb += `end_date < '${end_date}' and `
        }
        if(recruit.length>0){
            bodyComb += `recruit = ${recruit} and `
        }
        if(show.length>0){
            bodyComb += `\`show\` = ${show} and `
        }

        let sql = ( bodyComb == 'and ') ? '' : bodyComb.substr(0,bodyComb.length-5) ;

        let page = (req.query.id == undefined) ? 1 : req.query.id;

        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        
        let resultsall = await sequelize.query(`select * from curriculum where ifdeleted is null ${sql};`)
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
    
        let results = await sequelize.query(`select * from curriculum where ifdeleted is null ${sql} order by id desc limit 3 offset ${offset};`)
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
                res.render('../views/admin/curriculum_list.html',{ 
                    ifEmpty,
                    currList:result[0],
                    totalCurr:allCurr[0],
                    searchPages:page_array,
                    page, srcid, start_date, end_date, content, recruit, show,
                });
            })
    } catch(e){console.log(e)}
})



router.get('/curr/add', async(req,res)=>{
    try{
        res.render('../views/admin/curriculum_write.html')
        } catch(e){console.log(e)}
})

router.post('/curr/add_success', async(req,res)=>{ 
    try{
        let {subject, start_date, end_date, content, show} = req.body 
        console.log(req.body)
        let result = await Curriculum.create({
            subject, start_date, end_date, content, show
        })
        res.redirect('/admin/curr')
    }  catch(e){console.log(e)}
})

router.get('/curr/modify', async(req,res)=>{
    try{
        let result = await Curriculum.findOne({
            where:{id:req.query.id}
        })

        function getDate(date){
            var year = date.getFullYear()
            var month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            var day = date.getDate();
            day = day >= 10 ? day : '0' + day; 
            return  year + '-' + month + '-' + day;
        }

        let startDate = getDate(result.dataValues.start_date)
        let endDate = getDate(result.dataValues.end_date)

        res.render('../views/admin/curriculum_modify.html',{ //페이지명 변경 필요
            result, //뿌릴 이름 변경
            boardid:req.query.id,
            startDate, 
            endDate
        })
    } catch(e){console.log(e)}
})

router.post('/curr/modify_success', async(req,res)=>{
    try{ 
        console.log('asd')
        let {subject, start_date, end_date, content, show, recruit, boardid} = req.body
        console.log(req.body)
        let result = await Curriculum.update({
                subject, start_date, end_date, content, recruit, show
            },
            {where:{
                id:boardid
            }
        })
        res.redirect(`/admin/curr/view?id=${boardid}`)
        console.log(result)
    } catch(e){console.log(e)}
})

router.get('/curr/delete', async(req,res)=>{
    try{ 
        let id = req.query.id;
        function getTime(){
            let ifdeleted = new Date();
            return ifdeleted;
        }

        let deletedAt = Curriculum.update({
            ifdeleted: getTime()
        },
        {where:{
            id:req.query.id
        }})

        res.redirect('/admin/curr')
    } catch(e){
            console.log(e)
      };
})

router.post('/curr/delete',async (req,res)=>{
    try{ 
        let selDelItems = req.body.selDelItems
        console.log(selDelItems)
        function getTime(){
            let ifdeleted = new Date();
            return ifdeleted;
        }

        let deletedAt = Curriculum.update({
            ifdeleted: getTime()
        },
        {where:{
            id:selDelItems
        }})

        res.redirect('/admin/curr')
    } catch(e){
            console.log(e)
      };
})


module.exports = router;
