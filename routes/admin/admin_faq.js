const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Category, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");
//미들웨어 모든 항목에 추가 필요


router.get('/faq', async(req,res)=>{ 
    try{ 
        let loadData = await sequelize.query('SELECT * FROM faq AS A LEFT JOIN (select subject, id from category) AS B ON A.category=B.id;')
        console.log(loadData)
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        let allFaq = await sequelize.query('select * from faq;');
        let allCategory = await Category.findAll({
            where:{
                ifdeleted:null,
                show:1,
            }
        })
        let ifEmpty;
        if(allFaq[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from faq;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
        ;
        let results = await sequelize.query(`select a.id, title, content, category, date_format(registereddate, '%Y-%m-%d') as registereddate, a.\`show\`, category.subject from faq as a left join category on a.category = category.id order by id desc limit 3 offset ${offset};`)
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

                res.render('../views/admin/faq_list.html',{ 
                    faqList:result[0], //이거바꾸기
                    totalFaq:allFaq[0],  //이거바꾸기
                    searchPages:page_array,
                    ifEmpty,
                    totalCtg:allCategory
                });
                console.log(allFaq[0])
        })

       
        // module.exports = router;
    } catch(e){console.log(e)}
})

//삭제된 게시물 접근 거부
async function authDelAdmin(req,res,next){ 
    let getthat = await Faq.findOne(
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
            move: 'http://localhost:3000/admin/faq/'
        }
        res.render('../views/logincheck.html',{ adminDelAuth })
        return;
    }
}

router.get('/faq/view', authDelAdmin, async(req,res)=>{

    try{
        let result = await Faq.findOne({
            where:{id:req.query.id}
        }); 
        console.log(result);
        let getCtg = await Category.findOne({
            where:{id:result.dataValues.category}
        })
   
        
        function getDate(date){
            var year = date.getFullYear()
            var month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            var day = date.getDate();
            day = day >= 10 ? day : '0' + day; 
            return  year + '-' + month + '-' + day;
        }

        let date = getDate(result.dataValues.registereddate)
        //작동확인

        res.render('./admin/faq_view.html',{
            result,
            date,
            getCtg
        });
    } catch(e){console.log(e)}

})


router.get('/faq/search', async(req,res)=>{
    try{

        let allFaq = await sequelize.query('select * from faq;');
        let allCategory = await Category.findAll({
            where:{
                ifdeleted:null,
                show:1,
            }
        });
        console.log(allFaq[0])
        console.log('aaa',req.query)
        // 쿼리문 직접 추출
        let bodyComb = 'and '; 
        let {title, start_date, end_date, category, show} = req.query
        console.log('title : ',title);

        if(title.length>0){
            bodyComb += `title like '%${title}%' and `
        }
        if(start_date.length>0){
            bodyComb += `registereddate > '${start_date}' and `
        }
        if(end_date.length>0){
            bodyComb += `registereddate < '${end_date}' and `
        }
        if(category.length>0){
            bodyComb += `category = '${category}' and `
        }
        if(show.length>0){
            bodyComb += `category.\`show\` = ${show} and `
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

        let resultsall = await sequelize.query(`select * from faq ${sql};`)
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });
        
        ////////////검색
        let results = await sequelize.query(`select a.id, title, content, category, date_format(registereddate, '%Y-%m-%d') as registereddate, a.\`show\`, category.subject from faq as a left join category on a.category = category.id ${sql} order by id desc limit 3 offset ${offset};`)
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
                let ifEmpty;
                if(result[0].length==0){
                    ifEmpty = true;
                }
                res.render('../views/admin/faq_list.html',{ 
                    ifEmpty,
                    faqList:result[0],
                    totalFaq:allFaq[0],
                    searchPages:page_array,
                    page, start_date, end_date, category, show,
                    totalCtg:allCategory
                });
            })
    } catch(e){console.log(e)}
})

        // router.get('/admin',async(req,res)=>{
        //     let loadData = await sequelize.query('SELECT * FROM faq AS A LEFT JOIN (select category, id from category) AS B ON A.category=B.id;')
        //     // console.log('aaa',loadData)
        //         res.render('./admin_apply.html',{
        //         currName:loadData[1],
        //     })
        // })

router.get('/faq/add', async(req,res)=>{
    try{
        // let loadTags = await Category.findAll({
        // })
        let loadCtg = await Category.findAll({
            where:{
                show:1,
                ifdeleted:null,
            }
        })
        console.log(loadCtg)
        res.render('../views/admin/faq_write.html',{
            categoryList:loadCtg,
        })
    } catch(e){console.log(e)}
})

router.post('/faq/add_success', async(req,res)=>{ 
    try{
        let {title, category, content, show} = req.body 
        let result = await Faq.create({
            title, category, content, show
        })
        res.redirect('/admin/faq')
        console.log('asdasd')
    }  catch(e){console.log(e)}
})

router.get('/faq/modify', async(req,res)=>{
    try{
        let result = await Faq.findOne({
            where:{id:req.query.id}
        })
        let loadCtg = await Category.findAll({
            where:{
                show:1,
                ifdeleted:null,
            }
        })
        let ifEmpty;
        if(loadCtg[0].length==0){
            ifEmpty = true;
        }

        res.render('../views/admin/faq_modify.html',{ //페이지명 변경 필요
            ifEmpty,
            result, //뿌릴 이름 변경
            boardid:req.query.id,
            categoryList:loadCtg,
        })
    } catch(e){console.log(e)}
})

router.post('/faq/modify_success', async(req,res)=>{
    try{ 
        console.log('asd')
        let {title, category, content, show, boardid} = req.body
        console.log(req.body)
        let result = await Faq.update({
            title, category, content, show,
            },
            {where:{
                id:boardid
            }
        })
        res.redirect(`/admin/faq/view?id=${boardid}`)
        console.log(result)
    } catch(e){console.log(e)}
})

router.get('/faq/delete', async(req,res)=>{
    try{
        let id = req.query.id;
        await Faq.destroy({
            where:{id:id}
    })
        res.redirect('/admin/faq');
    } catch(error){console.log(error)}
})

router.post('/faq/delete',async (req,res)=>{
    try{ 
        let selDelItems = req.body.selDelItems
        console.log(selDelItems)

        let deletedAt = Faq.destroy({
            where:{id:selDelItems}
        })

        res.redirect('/admin/faq')

    } catch(e){
            console.log(e)
      };
})
























module.exports = router;
