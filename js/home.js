import {setMainSize} from "./functions.js";

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
