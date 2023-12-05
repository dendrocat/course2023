import * as func from "./functions.js";

let path = new URL(document.URL).searchParams.get("path");


function setDescription(desc) {
    let inner = document.querySelector("#description");
    for (let el of desc) {
        let type = String(typeof el);
        if (type == "object") {
            let label = document.createElement("label");
            label.className = "list";
            label.textContent = el["label"];
            inner.appendChild(label);
            let ul = document.createElement("ul");
            for (let text of el["data"]) {
                let li = document.createElement("li");
                li.textContent = text;
                ul.appendChild(li);
            }
            inner.appendChild(ul);
        }
        else {
            let p = document.createElement("p");
            p.textContent = el;
            inner.appendChild(p);
        }
    }
}

function setCharact(charact) {
    for (let key in charact) {
        let node = document.querySelector(`#${key}`);
        if (key == "age") node.textContent = charact[key] + "+";
        else node.textContent = charact[key];
    }
    
}


function getData() {
    fetch(`./database/products/${path}/data.json`).then(
        response => response.json()
    ).then(function(json) {
        document.querySelector(`#name`).textContent = json["name"];

        if (json["imgs"].length > 1) {
            for (let i = 0; i < json["imgs"].length; ++i) {
                let child = document.createElement("img");
                child.src = json["imgs"][i];
                child.className = "imgs";
                child.style.transform = `translateX(${105*i}%)`;
                child.style.display = 'block';
                document.querySelector("#images").appendChild(child);
            }
        }
        else {
            document.querySelector("#right").style.display = 'none';
            document.querySelector("#left").style.display = 'none';
        }

        document.querySelector("#mark").textContent = json["mark"];
        document.querySelector("#brand-short").textContent = json["charact"]["brand"];
        document.querySelector("#price").textContent = json["price"];
        document.querySelector("#article").textContent = path.substring(path.indexOf("/") + 1);
        
        setDescription(json["description"]);
        setCharact(json["charact"]);
    });
}


getData();
let cur_img = 0;
function translateX(direction) {
    let images = document.querySelectorAll(".imgs");
    if (direction == "right") {
        if (cur_img == images.length - 1) return;
        ++cur_img;
    }
    else {
        if (cur_img == 0) return;
        --cur_img;
    }
    for (let i = 0; i < images.length; ++i) {
        images[i].style.transform = `translateX(${-105*(cur_img-i)}%)`;
    }

}

document.querySelector("#right").onclick = function() {
    translateX("right");
}

document.querySelector("#left").onclick = function() {
    translateX("left");
}



if (func.checkInBin(path)) {
    document.querySelector("#add").removeChild(document.querySelector("#img-add"));
    document.querySelector("#span-add").textContent = "Перейти в корзину";
}



document.querySelector("#add").onclick = function() {
    if (!func.checkInBin(path)) {
        this.removeChild(document.querySelector("#img-add"));
        document.querySelector("#span-add").textContent = "Перейти в корзину";
        func.addToBin(path);
    }
    else {
        window.location = "bin.html";
    }
}

document.querySelector("#all").onclick = function() {
    document.querySelector("#main-descript").scrollIntoView({
        behavior: "smooth"
    });
}

func.setMainSize();
