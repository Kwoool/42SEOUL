$(function () {
    let container = $('#pagination');
    container.pagination({
        dataSource: [
            {id:"1" , subject:"1", name: "ingoo" , cource:"블록체인"},
            {id:"2" , subject:"2", name: "홍길동" , cource:"블록2"},
            {id:"3" , subject:"제목3", name: "이서방" , cource:"체인3"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인4"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
            {id:"1" , subject:"제목", name: "ingoo" , cource:"블록체인"},
        ],
        callback: function (data, pagination) {
            var dataHtml = '<ul>';

            $.each(data, function (index, item) {
                dataHtml += '<li>'
                + '<div class="list_id">' + "No : " + item.id + '</div>' 
                + '<div class="list_subject">' + "제목 : " + item.subject + '</div>'
                + '<div class="list_name">' + "이름 : " +  item.name + '</div>'
                + '<div class="list_cource">' + "교육과정 : " + item.cource + '</div>'+
                '</li>';
            });

            dataHtml += '</ul>';

            $("#data-container").html(dataHtml);
        }
    })
})