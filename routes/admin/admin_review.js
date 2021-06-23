const express = require('express');
const router = express.Router();
const {sequelize, Application, Curriculum, Faq, Hashtag, Review, Notice, User} = require('../../models/index')
const getCookie = require('../../middleware/getcookie');
const authAdmin = require('../../middleware/authadmin');
const { Op } = require("sequelize");
//미들웨어 모든 항목에 추가 필요


router.get('/review',async (req,res)=>{
    try{
        let result = await Review.findAll({})
        res.render('../views/admin/review_list.html',{
            noticeList:result,
    })
    } catch(e){console.log(e)}
})


router.get('/review/view',async (req,res)=>{
    try{
    

    let result = await Review.findAll({
        where:{id:req.query.id}
    }); //여기서 아이디 빼오기
    let writer = result[0].dataValues.userid;
    
    //관리자 권한에서는 조회수 기능 제거

    getCurrId = (result[0].dataValues.curr_id)
    // 게시물에서 curr_id 추출

        let [getSub] = await Curriculum.findAll({
            attributes:['id','subject'],
            where:{
                id:getCurrId
            }
        }) 


    // 수강기록에 맞추어 제목을 추출
    // 하여 배열에 담는다
    res.render('./review/view.html',{
        reviewList:result,
        getSub: getSub.dataValues.subject,
        writer
    });
    } catch(e){console.log(e)}
})
// 권한부여 추가
router.get('/review/modify', async(req,res)=>{
    try{


        let result = await Review.findOne({
            where:{id:req.query.id}
        })

        let writer = result[0].dataValues.userid;

        res.render('./review/modify.html',{
            loadReview: [result],
            writer,
            boardid:req.query.id
        })
    } catch(e){console.log(e)}
})

router.post('/review/modify_success',async (req,res)=>{
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

router.get('/review/delete', async(req,res)=>{
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
