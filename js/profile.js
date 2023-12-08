import {setMainSize} from './functions.js';

function checkLogin(input) {
    let login = input.value;
    let end = ["ru", "com"];
    let i_sob = login.indexOf("@");
    let i_point = login.lastIndexOf(".");
    if ( i_sob < 1|| i_point < 0 || (i_point - i_sob) < 4) {
        return "Ошибка ввода логина";
    }
    return null;
}


function checkPasswd(input) {
    let passwd = input.value;
    if (passwd.length < 8) {
        return "В пароле должно быть больше 8 символов";
    }
    if (passwd.match(/[А-Яа-я]/g)) {
        return "В пароле не может быть русских букв";
    }
    if (passwd.match(/[A-Z]/g) == null) {
        return "В пароле должна быть хотя бы одна заглавная бука английского алфавита";
    }
    if (passwd.match(/[a-z]/g) == null) {
        return "В пароле должна быть хотя бы одна строчная бука английского алфавита";
    }
    if (passwd.match(/[_!@#$%^&*]/g) == null) {
        return "В пароле должен быть хотя бы один специальный символ";
    }
    if (passwd.match(/[0-9]/g) == null) {
        return "В пароле должна быть хотя бы одна цифра";
    }
    return null;
}

function checkNames(input, id) {
    let sur;
    if (id == "surname") sur = "Фамилия должна";
    else if (id == "name") sur = "Имя должно";
    else sur = "Отчество должно";
    let name = input.value;
    if (name.match(/^[A-Za-zА-Яа-я]+/g) == null) {
        return `${sur} состоять только из букв`;
    }
    else if (name[0].match(/[A-ZА-Я]/g) == null) {
        return `${sur} начинаться с заглавной буквы`;
    }
    return null;
}

function check(id) {
    let checking = document.querySelector(`#${id}`);
    let err;
    if (id == "login") {
        err = checkLogin(checking);
    }
    else if (id == "passwd") {
        err = checkPasswd(checking);
    }
    else {
        err = checkNames(checking, id);
    }

    if (err != null) {
        checking.parentNode.querySelector(".err").textContent = err;
        return false;
    }
    else {
        checking.parentNode.querySelector(".err").textContent = "";
        return true;
    }
    
}


let color_input_active = "rgb(53 77 77)";
let color_input_disabled = "rgb(83 129 129)";
let color_disabled = "rgb(200 200 200)";
function activeButton() {
    let inputs = document.querySelectorAll(".input");
    let active = true;
    for (let input of inputs) {
        if (input.value.length == 0) active = false;
    }
        let button = document.querySelector("#save");
    if (active) {
        button.disabled = false;
        button.style.color = "whitesmoke";
        button.onmouseover = function() {
            let box = "0 0 20px 0 rgba(0, 0, 0, 0.3) inset";
            this.style.boxShadow = box;
        }
    }
    else {
        button.disabled = true;
        button.style.color = color_disabled;
        button.onmouseover = function() {
            this.style.boxShadow = "";
        }
    }
}

for (let input of document.querySelectorAll(".input")) {
    input.onchange = activeButton;
    input.disabled = true;
}

document.querySelector("#save").style.color = "whitesmoke";
document.querySelector("#save").onmouseover = function() {
    let box = "0 0 20px 0 rgba(0, 0, 0, 0.3) inset";
    this.style.boxShadow = box;
}
document.querySelector("#save").onmouseout = function() {
    this.style.boxShadow = "";
}


function getProfile() {
    let profile = sessionStorage.profile;
    if (profile) {
        profile = JSON.parse(sessionStorage.profile);
        for (let id in profile) {
            let input = document.querySelector(`#${id}`);
            input.value = profile[id];
        }
    }
}

let ids = ["login", "passwd", "surname", "name", "secname"];
function saveProfile() {
    let profile = sessionStorage.profile;
    if (profile) {
        profile = JSON.parse(sessionStorage.profile);
    }
    else profile = {};
    ids = ["login", "passwd", "surname", "name", "secname"];
    for (let id of ids) {
        let input = document.querySelector(`#${id}`);
        profile[id] = input.value;
    }
    sessionStorage.profile = JSON.stringify(profile);
}

document.querySelector("#save").onclick = function() {
    if (this.textContent == "Сохранить") {
        let save = true;
        for (let id of ids) {
            if (!check(id)) save = false;
        }
        if (save) {
            this.textContent = "Изменить";
            for (let id of ids) {
                let input = document.querySelector(`#${id}`);
                input.disabled = true;
                input.style.color = color_input_disabled;
            }
            saveProfile();
        }
    }
    else {
        for (let input of document.querySelectorAll(".input")) {
            input.disabled = false;
            input.style.color = color_input_active;
        }
        this.textContent = "Сохранить";
        activeButton();
    }
}


function getCountProducts() {
    let bin = sessionStorage.bin;
    if (bin) {
        bin = JSON.parse(bin);
        let count = 0;
        for (let product of bin) {
            count += product["count"];
        }
        return count;
    }
    return 0;
}

document.querySelector("#count").textContent = getCountProducts();


getProfile();

setMainSize();
