const express = require('express');
const router = express.Router();
const {sequelize,Review, Curriculum} = require('../../models/index')

//페이지 세팅 필요할지?

router.get('/',async (req,res)=>{
    try{
        let result = await Faq.findAll({})
        res.render('../views/faq/faq_index.html',{
            noticeList:result,
    })
    } catch(e){console.log(e)}
})

router.get('/view',async (req,res)=>{
    try{
        let result = await Faq.findAll({
            where:{id:req.query.id}
        }); 
  
        
        // let hit = result[0].dataValues.hit
        //     hit+=1;
        // let addHit = await Review.update({
        //     hit:hit
        // },{where:{id:req.query.id}})
        //view 로드시 조회수 올릴 것인지 판단 필요

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
        res.render('./faq/view.html',{
            result,
            getSub: getSub.dataValues.subject,
            signedinId
        });
        } catch(e){console.log(e)}
})

module.exports = router;