import * as func from "./functions.js";


let params = new URL(document.URL).searchParams;
let checked = [];
if (params.size > 0) {
    for (let [check, label] of params) {
        checked.push(check);
        checked.push(label);
    }
}
else checked = null;


function addBin() {
    let path = this.parentNode.querySelector(".img").href;
    path = path.substring(path.indexOf("=") + 1);
    if (!func.checkInBin(path)) {
        func.addToBin(path);
        this.lastChild.src = "./database/img/check_mark.png";
        this.lastChild.style.width = "30px";
    }
}

function getPrice(price) {
    let str_price = String(price);
    return str_price.match(/\d{1,3}(?=(\d{3})*$)/g).join(" ");
}

function addCard(json) {
    
    let card = document.createElement("div");
    card.className = "card";

    let a_img = document.createElement("a");
    a_img.href = `./product.html?path=${json["path"]}`;
    a_img.className = "img";
    let img = document.createElement("img");
    img.className = "image";
    img.src = json["img"];
    a_img.appendChild(img);
    card.appendChild(a_img);

    let div_mark = document.createElement("div");
    div_mark.className = "mark";

    let zv_img = document.createElement("img");
    zv_img.src = "./database/img/star.png";
    div_mark.appendChild(zv_img);
    let p_mark = document.createElement("p");
    p_mark.textContent = json["mark"];
    div_mark.appendChild(p_mark);
    card.appendChild(div_mark);

    let a_name = document.createElement("a");
    a_name.href = `./product.html?path=${json["path"]}`;
    a_name.textContent = func.trancate(json["name"]);
    a_name.className = "name";
    card.appendChild(a_name);

    let p = document.createElement("p");
    p.className = "price";
    p.textContent = `${getPrice(json["price"])} ₽`;
    card.appendChild(p);

    let button = document.createElement("button");
    button.className = "add";
    button.onclick = addBin;
    let button_img = document.createElement("img");
    if (!func.checkInBin(json["path"])) button_img.src = "./database/img/backet.png";
    else {
        button_img.src = "./database/img/check_mark.png";
        button_img.style.width = "30px";
    }
    button.appendChild(button_img);
    card.appendChild(button);

    document.querySelector("#products").appendChild(card);

}

function getLabelText(old_str) {
    return old_str[0].toUpperCase() + old_str.slice(1);
}

function getId(old_str) {
    return old_str.split(" ").join("");
}

function createChecks(jsons, nameCheck) {
    let div = document.querySelector(`#${nameCheck}`);
    let labels = [];
    for (let json of jsons) {
        if (json[nameCheck] != "-" && !labels.includes(json[nameCheck])) { 
            labels.push(json[nameCheck]);
            let checks = document.createElement("div");
            checks.className = "checks";
            let input = document.createElement("input");
            input.type = "checkbox";
            input.id = getId(json[nameCheck]);
            input.className = `${nameCheck}s cheks`;
            if (checked && checked[1].toLowerCase() == getId(json[nameCheck]).toLowerCase()) {
                input.checked = true;
            }
            let label = document.createElement("label");
            label.htmlFor = getId(json[nameCheck]);
            label.textContent = getLabelText(json[nameCheck]);
            label.className = `${nameCheck}s-labels`;

            checks.appendChild(input);
            checks.appendChild(label);
            div.appendChild(checks);
        }  
    }
}


function setMinMaxPrices(jsons) {
    let min = 1000000, max = 0;
    for (let json of jsons) {
        if (json["price"] < min) min = json["price"];
        if (json["price"] > max) max = json["price"];
    }
    let price_inputs = document.querySelectorAll(".price-input");
    [price_inputs[0].value, price_inputs[1].value] = [min, max];

}



function Product(path, type, img, name, brand, price, mark, sex, age) {
    return {
        path,
        type,
        img,
        name, 
        brand,
        price,
        mark,
        sex,
        age
    }
}


async function getData(json) {
    let length = 50;
    let new_products = [];
    for (let key in json) {
        for (let article in json[key]) {
            let response = await fetch(`./database/products/${json[key][article]}/data.json`);
            let json_prod = await response.json();
            
            new_products.push(new Product(
                json[key][article], 
                key, 
                json_prod["imgs"][0],
                func.trancate(json_prod["name"], length),
                json_prod["charact"]["brand"], 
                Number(json_prod["price"].split(" ").join('')),
                Number(json_prod["mark"]), 
                json_prod["charact"]["sex"],
                `от ${json_prod["charact"]["age"]} лет`
            ));
        }
    }
    return new_products;
}

let windowWidth = document.body.clientWidth;
function setMainSize() {
    let filter = document.querySelector("#filters");
    let filter_height = filter.clientHeight;
    let filterPaddingTop = Number(window.getComputedStyle(filter).paddingTop.slice(0, -2));
    filter_height += filterPaddingTop;
    
    let h1_height = 0;
    let h1_style = window.getComputedStyle(document.querySelector("h1"));
    h1_height = Number(h1_style.marginTop.slice(0, -2));
    h1_height += Number(h1_style.height.slice(0, -2));
    h1_height += Number(h1_style.marginBottom.slice(0, -2));

    func.setMainSize(filter_height + h1_height);
    if (windowWidth < 1001) return `calc(100% - ${filterPaddingTop}px)`;
    else return `${filter_height - 2*filterPaddingTop}px`;
}

let products = [];
async function createCards() {

    let error = document.querySelector("#error");
    let filters = document.querySelector("#filters");
    let products_cards = document.querySelector("#products");
    error.style.display = "block";
    filters.style.display = "none";
    products_cards.style.display = "none";

    // загрузка данных
    setMainSize();

    let response = await fetch("./database/products/data.json");
    let json = await response.json();
    products = await getData(json);

    // создание input[type="checkbox"] для реализации фильтрации
    products.sort(func.compareBrands);
    createChecks(products, "brand"); 
    products.sort(func.compareTypes);
    createChecks(products, "type");
    products.sort(func.compareSexs);
    createChecks(products, "sex");
    products.sort(func.compareAges);
    createChecks(products, "age");
    // установка минимальной и максимальной цены для фильтрации
    setMinMaxPrices(products);

    products.sort(func.compareMarks);
    //console.log(products);
    products.forEach(el => {
        if (checked) {
            if (getId(el[checked[0]]).toLowerCase() == checked[1].toLowerCase()) 
                addCard(el);
        }
        else addCard(el); // функция создания карточки товара по json объекту
    });


    error.style.display = "none";
    filters.style.display = "block";
    products_cards.style.display = "flex";

    filters.style.height = setMainSize();
}

createCards();

function checkLimits(value, min, max) {
    value = Number(value);
    min = Number(min);
    max = Number(max);
    if (value > max) value = max;
    if (value < min) value = min;
    return value;
}

let price_inputs = document.querySelectorAll(".price-input");
price_inputs[0].onchange = function() {
    this.value = checkLimits(price_inputs[0].value, 
                            price_inputs[0].min, 
                            price_inputs[1].value);
}
price_inputs[1].onchange = function() {
    this.value = checkLimits(price_inputs[1].value, 
                            price_inputs[0].value, 
                            price_inputs[1].max);
}


function closeFilter() {
    document.querySelector("#button-close").checked = false;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelector("#clear").onclick = function() {
    let checkboxes = document.querySelectorAll(".cheks");
    checkboxes.forEach(el => {
        el.checked = false;
    });
    setMinMaxPrices(products);

    document.querySelector("#products").innerHTML = '';
    for (let i = 0; i < products.length; ++i) {
        addCard(products[i]);
    }

    closeFilter();
}

function getAge(str) {
    return Number(str.split(" ")[1]);
}
function getChecksInform(name) {
    let input = document.querySelectorAll(`.${name}s`);
    let label = document.querySelectorAll(`.${name}s-labels`);
    let inform_checked = [];
    let inform_all = [];
    for (let i = 0; i < input.length; ++i) {
        if (input[i].checked) {
            inform_checked.push(label[i].textContent);
        }
        inform_all.push(label[i].textContent);
    }
    if (inform_checked.length > 0) return inform_checked;
    return inform_all;
}

function getFiltersInform() {
    let brands = getChecksInform("brand");
    let types = getChecksInform("type");
    let sexs = getChecksInform("sex");
    let ages = getChecksInform("age");
    for (let i = 0; i < sexs.length; ++i) sexs[i] = sexs[i].toLowerCase();
    
    let min_age = 100;
    for (let i = 0; i < ages.length; ++i) {
        let age = getAge(ages[i]);
        if (age < min_age) min_age = age;
    }
    

    let price_input = document.querySelectorAll(".price-input");
    let prices = [Number(price_input[0].value), 
                    Number(price_input[1].value)];
    return [brands, types, sexs, min_age, prices];
}

function doFilter() {
    let brands = [], types = [], sexs = [], min_age, prices = [];
    [brands, types, sexs, min_age, prices] = getFiltersInform();

    let container = document.querySelector("#products");
    container.innerHTML = '';
    for (let product of products) {
        let brand = brands.includes(product["brand"]);
        let type = types.includes(product["type"]);
        let price = (product["price"] >= prices[0] 
                    && product["price"] <= prices[1]);
        let sex = sexs.includes(product["sex"]);
        let age = getAge(product["age"]) >= min_age;
        if (brand && type && price && sex && age) addCard(product);
    }

    closeFilter();
}


document.querySelector("#confirm_filt").onclick = function() {
    doFilter();
}
