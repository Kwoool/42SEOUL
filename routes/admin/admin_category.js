const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Category, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");


router.get('/category', async(req,res)=>{ 
    try{ // 이 부분 페이지네이션하고 번호 등등 만들기
        let page = (req.query.id == undefined) ? 1 : req.query.id;
        let offset = ( req.query.id == undefined) ? 0 : 3 * (page - 1);
        let page_array = [];

        let allCategory = await sequelize.query('select * from category where ifdeleted is null;')
        let ifEmpty;
        if(allCategory[0].length==0){
            ifEmpty = true;
        }
        let resultsall = await sequelize.query('select * from category where ifdeleted is null;')
        .then((resultall) => {
            let totalrecord = resultall[0].length;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

        let results = await sequelize.query(`select * from category where ifdeleted is null order by id desc limit 3 offset ${offset};`)
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

                res.render('../views/admin/category_list.html',{ 
                    cateList:result[0], 
                    // totalCategory:allCategory[0], 
                    searchPages:page_array,
                    ifEmpty,
                });
        })
    } catch(e){console.log(e)}
})

//삭제된 게시물 접근 거부
async function authDelAdmin(req,res,next){ 
    let getthat = await Category.findOne(
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
            move: 'http://localhost:3000/admin/category/'
        }
        res.render('../views/logincheck.html',{ adminDelAuth })
        return;
    }
}

router.get('/category/view', authDelAdmin, async(req,res)=>{

    try{
        let result = await Category.findOne({
            where:{id:req.query.id}
        }); 

        res.render('./admin/category_view.html',{
            result,
        });
    } catch(e){console.log(e)}

})

router.get('/category/add', async(req,res)=>{
    try{
        res.render('../views/admin/category_write.html')
    } catch(e){console.log(e)}
})

router.post('/category/add_success', async(req,res)=>{ 
    try{
        let {subject, show} = req.body //아마 수정필요?
        let result = await Category.create({
            subject, show //날짜 작동 확인
        })
        res.redirect('/admin/category')
    } catch(e){console.log(e)}
})

router.get('/category/modify', async(req,res)=>{
    try{
        let result = await Category.findOne({
            where:{id:req.query.id}
        })
        res.render('../views/admin/category_modify.html',{ //페이지명 변경 필요
            result, //뿌릴 이름 변경
            boardid:req.query.id
        })
    } catch(e){console.log(e)}
})

router.post('/category/modify_success', async(req,res)=>{
    try{
        let {subject, show} = req.body
        let result = await Category.update({
            subject, show //날짜 작동 확인
        },
        {where:{
            id:boardid
        }})
        res.redirect('/admin/category')
    } catch(e){console.log(e)}
})

router.get('/category/delete', async(req,res)=>{
    try{ 
        let id = req.query.id;
        function getTime(){
            let ifdeleted = new Date();
            return ifdeleted;
        }

        let deletedAt = Category.update({
            ifdeleted: getTime()
        },
        {where:{
            id:req.query.id
        }})

        res.redirect('/admin/category')
    } catch(e){
            console.log(e)
      };
})

router.post('/category/delete',async (req,res)=>{
    try{ 
        let selDelItems = req.body.selDelItems
        console.log(selDelItems)
        function getTime(){
            let ifdeleted = new Date();
            return ifdeleted;
        }

        let deletedAt = Category.update({
            ifdeleted: getTime()
        },
        {where:{
            id:selDelItems
        }})

        res.redirect('/admin/category')
    } catch(e){
            console.log(e)
      };
})



module.exports = router;