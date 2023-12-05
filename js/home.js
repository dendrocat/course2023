import {setMainSize, addToBin, checkInBin} from "./functions.js";

setMainSize();


let types = document.querySelectorAll(".type-card");

let cur_type = 0;


function moveScroll(direction) {
    
    let parent = types[cur_type].parentNode;
    let parentStyle = parent.currentStyle || window.getComputedStyle(parent);
    let columnGap = Number(parentStyle.columnGap.slice(0, -2));
    
    if (direction == "left" && cur_type > 0) cur_type--;
    if (direction == "right" && cur_type != types.length - 1) cur_type++;

    let scrollElem = document.querySelector("#type-cards");

    let plus = columnGap + types[cur_type].clientWidth;
    if (direction == "right") scrollElem.scrollLeft += plus + 2;
    else scrollElem.scrollLeft -= plus + 2;
    
}

document.querySelector("#left").onclick = function() {
    moveScroll("left");
}

document.querySelector("#right").onclick = function() {
    moveScroll("right");
}

function getPath(button) {
    let path = button.parentNode.querySelector(".img").href;
    return path.substring(path.indexOf("=") + 1);
}
function setMark(button) {
    button.childNodes[1].src = "./database/img/check_mark.png";
    button.childNodes[1].style.width = "30px";
}

function addBin() {
    let path = getPath(this);
    if (!checkInBin(path)) {
        addToBin(path);
        setMark(this);
    }
}

let buttons = document.querySelectorAll(".add");

for (let button of buttons) {
    button.onclick = addBin;
    let path = getPath(button);
    if (checkInBin(path)) setMark(button);
}
