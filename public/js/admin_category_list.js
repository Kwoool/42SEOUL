function init(){
    let addBtn = document.querySelector('#addBtn');


    addBtn.addEventListener('click',function(){
        console.log('[a')
        window.location.href ='http://localhost:3000/admin/category/add'
    })



    let selDel = document.querySelector('#selDel')
    let delBtn = document.querySelector('#delBtn')
    let selAll = document.querySelector('#selAll')
    let selOpt = document.querySelectorAll('.selOpt')
   
    delBtn.addEventListener('click',deleteAll);
    selAll.addEventListener('click',()=>{
        if(selAll.checked == true){
            for(let i=0;i<selOpt.length;i++){
                if(selOpt[i].checked==false){
                    selOpt[i].checked = true;
                }
            } return false;
        } else{
            for(let i=0;i<selOpt.length;i++){
                if(selOpt[i].checked==true){
                    selOpt[i].checked = false;
                }
            }
            return true;
        }
    });

    async function deleteAll(){
        console.log('선택 삭제 버튼 접근 중');
        let selChk = document.querySelectorAll(".selOpt:checked");
        console.log(selChk)
        if(selChk.length==0){
            alert('최소 하나 이상의 항목을 선택하세요')
            return;
        } else{
            if(confirm("정말 삭제하시겠습니까?")==true){
                for(let i=0;i<selOpt.length;i++){
                    if(selOpt[i].checked==false){
                        selOpt[i].disabled = true;
                    }
                }
                selDel.submit();
                for(let i=0;i<selOpt.length;i++){
                    selOpt[i].disabled = false;
                }
                console.log('submit done')
                selAll.checked = false;
            } else{
                return;
            }
        }
    }

}



document.addEventListener('DOMContentLoaded',init)
