import {trancate, setMainSize} from './functions.js';


function getText(str) {
    return str.split(" ").join("");
}

function splitThrees(str) {
    let new_str = "", count = 0;
    for (let i = str.length - 1; i >= 0; --i) {
        if (count == 3) {
            count = 0;
            new_str = str[i] + " " + new_str;
        }
        else new_str = str[i] + new_str;
        ++count;
    }
    return new_str;
}

function updRes() {
    let prices = document.querySelectorAll(".price");
    let count = document.querySelectorAll(".count");
    let res = 0;
    for (let i = 0; i < prices.length; ++i) {
        if (Number(getText(prices[i].textContent)) > 0) res += Number(getText(prices[i].textContent)) * Number(count[i].value);
    }
    if (res != 0) {
        document.querySelector("#res").textContent = splitThrees(String(res));
    }
    else {

    }
}


function changeCount(input, direction) {
    let count = input.value;
    if (direction == "minus") --count;
    else ++count;
    input.value = count;
}

function getPath(el) {
    let abs_path = el.parentNode.parentNode.querySelector(".img").src;

    return abs_path.substring(
        abs_path.indexOf("products/") + "products/".length,
        abs_path.lastIndexOf("/")
    )
}


function translateElem(elem) {
    elem.style.transform = 'translateX(-200%)';
    elem.style.padding = "0";
    elem.style.height = "0";
    elem.style.marginBottom = "-10px";
}

function updBin(path, count) {
    let arr = JSON.parse(sessionStorage.bin);
    let i = arr.findIndex(el => el["path"] == path);
    if (count <= 0) arr.splice(i, 1);
    else arr[i]["count"] = Number(count);
    sessionStorage.bin = JSON.stringify(arr);
    
    if (arr.length == 0) {
        translateElem(document.querySelector("#container-res"));
        window.setTimeout(() => {
            document.querySelector("#empty-bin").style.display = "block";
            document.querySelector("#container-res").style.display = "none";
        }, 550);
    }
}

 
function changeCountMinus() {
    let input = this.parentNode.querySelector(".count");
    changeCount(input, "minus");
    let arr = JSON.parse(sessionStorage.bin);
    if (input.value <= 0) {
        let cur_card = this.parentNode.parentNode;
        translateElem(cur_card);
        window.setTimeout(function(div, deleted, button, input) {
            div.removeChild(deleted);
            updBin(getPath(button), input.value);
        }, 550, cur_card.parentNode, cur_card, this, input);        
    }
    updRes();
}

function changeCountPlus() {
    let input = this.parentNode.querySelector(".count");
    changeCount(input, "plus");
    updBin(getPath(this), input.value);    
    updRes();
}

function addCard(json, count) {
    let card = document.createElement("div");
    card.className = "card";

    let a_img = document.createElement("a");
    let path = json["imgs"][0];
    path = path.substring(path.indexOf("products/") + "products/".length, path.lastIndexOf("/"));
    a_img.href = `product.html?path=${path}`
    a_img.className = "a-img";
    let img = document.createElement("img");
    img.src = json["imgs"][0];
    img.className = "img";
    a_img.appendChild(img);
    card.appendChild(a_img);

    let a_name = document.createElement("a");
    a_name.textContent = trancate(json["name"], 50);
    a_name.className = "name";
    a_name.href = `product.html?path=${path}`;
    card.appendChild(a_name);

    let p_price = document.createElement("p");
    p_price.innerHTML = `<span class="price">${json["price"]}</span> ₽`;

    card.appendChild(p_price);

    let buttons = document.createElement("div");
    buttons.className = "buttons";

    let button_minus = document.createElement("button");
    button_minus.onclick = changeCountMinus;
    button_minus.textContent = "-";
    button_minus.className = "minus";
    buttons.appendChild(button_minus);

    let input = document.createElement("input");
    input.type = "number";
    input.className = "count";
    input.value = count;
    buttons.appendChild(input);

    let button_plus = document.createElement("button");
    button_plus.onclick = changeCountPlus;
    button_plus.textContent = "+";
    button_plus.className = "plus";
    buttons.appendChild(button_plus);

    card.appendChild(buttons);

    
    document.querySelector("#products").appendChild(card);
}


let products = [];
async function createCards() {
    let error = document.querySelector("#error");
    let empty_bin = document.querySelector("#empty-bin");
    let container = document.querySelector("#container-res");
    error.style.display = "block";
    empty_bin.style.display = "none";
    container.style.display = "none"
    setMainSize();

    let bin = null;
    if (sessionStorage.bin) bin = JSON.parse(sessionStorage.bin);
    if (bin && bin.length > 0) {
        for (let el of bin) {
            let response = await fetch(`./database/products/${el["path"]}/data.json`);
            let json = await response.json();
            
            addCard(json, el["count"]);
        }
        container.style.display = "grid";
        updRes();
    }
    else {
        empty_bin.style.display = "block";
    }

    error.style.display = "none";
    setMainSize();
}

createCards();

document.querySelector("#pay").onclick = function() {
    window.location.href = "./error.html";
}
