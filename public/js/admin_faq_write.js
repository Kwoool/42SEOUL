function init(){
    let writeBtn = document.querySelector('#writeBtn');
    let backBtn = document.querySelector('#backBtn');
    let submitWri = document.querySelector('#submitWri');
    let ctgFaq = document.querySelector('#ctgFaq');

    writeBtn.addEventListener('click',function(){


        if(ctgFaq.value.length>0){
            submitWri.submit();
        } else{
            alert('카테고리를 선택해주세요.')
        }
    })
    
    backBtn.addEventListener('click',function(){
        window.location.href ='http://localhost:3000/admin/curr/'
    })
}

document.addEventListener('DOMContentLoaded',init)