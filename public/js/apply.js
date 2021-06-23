const apply_init = () =>{
    let curr_id = document.querySelector('#curr_id');
    let username = document.querySelector('#username');
    let gender = document.querySelector('#gender');
    let userage = document.querySelector('#userage');
    let useremail = document.querySelector('#useremail');
    let userphone = document.querySelector('#userphone');
    let motive = document.querySelector('#motive');

    let agree = document.querySelectorAll('#agree');
    let submit = document.querySelector('#submit');

    // 개인정보 취급방침 동의 여부 체크
    submit.addEventListener('click',()=>{
        console.log('submit 클릭');

        if (curr_id.value == '' || username.value == '' || gender.value == '' || userage.value == '' || useremail.value == '' || userphone.value == '' || motive.value == ''){
            console.log('빈 칸 있음');
            return;
        } else{
            console.log('빈 칸 없음');
            if (agree[1].checked == true){
                agree[1].checked = false;
                alert('개인정보 취급방침 동의 후 신청이 가능합니다.');
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', apply_init);