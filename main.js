$(function () {

    $('#fullpage').fullpage({
        //options here
        navigation: true,
        navigationPosition: 'right'
    });
})

/*function none_block() {
    const play = document.getElementById("bush");
    if (play.style.display == "none") {
        play.style.display = "block";
    } else {
        play.style.display = "none";
    }
}*/

function menu_on(){
    eee = document.querySelector(".three_bar");
    ddd = document.querySelector(".menu_container")
    ddd.style.display = "block"
}

function menu_out(){
    fff = document.querySelector(".x_bar");
    ggg = document.querySelector(".menu_container")
    ggg.style.display = "none"
}