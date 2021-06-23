function init(){
    let pwSubmit = document.querySelector('#pwSubmit');
    let pwInput = document.querySelector('#pwInput');
    let pwd = document.querySelector('#pwd');
    let postId = document.querySelector('#postidbox');

    pwSubmit.addEventListener('click',function(){

        if(pwInput.value.length>=1){
            pwChk();
            pwd.submit();
        } else{
            alert('비밀번호를 입력해주세요.')
        }

    })


    async function pwChk(){
        console.log('asdf')
        
        const userid = document.querySelector('#userid');
        const userpw = document.querySelector('#userpw');
        let url = 'http://localhost:3000/review/pwchk'
    
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userpw:pwInput.value,
                postid:postId.value
            })
        }
        console.log(options)
    
        let response = await fetch(url,options);
        let json = await response.json();
        let {result} = json;
    
        console.log(result)
        if(result){
            location.href=`http://localhost:3000/review/modify?id=${postId}`
            console.log('ㅋㅋㅋ')
        } else{
            userid.value = '';
            userpw.value = '';
            userid.focus();
            alert('비밀번호가 일치하지 않습니다')
        }
        
    }


}

document.addEventListener('DOMContentLoaded',init);

