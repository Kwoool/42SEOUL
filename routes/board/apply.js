const express = require('express');
const router = express.Router();

const {sequelize,Application,Curriculum} = require('../../models/index')

router.get('/', async(req,res)=>{
    console.log('apply 접근중');

    try{
        let result = await Curriculum.findAll({
            where:{show:1,ifdeleted:null},
            raw:true,
        })

        res.render('./apply.html',{
            currList:result,
        })
    }
    catch(e){
        console.log(e)
    }
})

router.post('/submit',async(req,res)=>{
    console.log('apply submit 접근중');

    let {curr_id, username, gender, userage, useremail, userphone, content} = req.body;
    
    console.log('req.body : ',req.body);

    let applyAdd = await Application.create({
        curr_id, username, gender, userage, useremail, userphone, content,
    })

    res.render('./apply_complete.html');
})

//이건 나중에 관리자페이지에 들어갈 예정.. 전송된 지원 폼 리스트
router.get('/admin',async(req,res)=>{
    let loadData = await sequelize.query('SELECT * FROM application AS A LEFT JOIN (select subject, id from curriculum) AS B ON A.curr_id=B.id;')
    // console.log('aaa',loadData)
        res.render('./admin_apply.html',{
        currName:loadData[1],
    })
})

module.exports = router;