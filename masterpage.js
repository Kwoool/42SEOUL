/* 상담신청 버튼 눌렀을때 자동으로 li가 생성되는 js */

  

function apply(){
    cardList = document.querySelector('.counseling');
    li = document.createElement('li');
          
    div1 =document.createElement('div')
    div1.className = "delete_box delBtn"
    div1.innerHTML = "X"
    div1.addEventListener('click', function(){
        this.parentNode.remove()
    })
    div = document.createElement('div')
    div.className = "chatting_box"
    li.appendChild(div1);
    li.appendChild(div);             
    cardList.appendChild(li);       
}





