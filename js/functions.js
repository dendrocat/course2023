export function compareMarks(a, b) {
    if (a["mark"] < b["mark"]) return 1;
    else if (a["mark"] > b["mark"]) return -1;
    return 0;
}
export function compareBrands(a, b) {
    if (a["brand"] < b["brand"]) return -1;
    else if (a["brand"] > b["brand"]) return 1;
    return 0;
}
export function compareTypes(a, b) {
    if (a["type"] < b["type"]) return -1;
    else if (a["type"] > b["type"]) return 1;
    return 0;
}
export function compareSexs(a, b) {
    if (a["sex"] < b["sex"]) return -1;
    else if (a["sex"] > b["sex"]) return 1;
    return 0;
}
export function compareAges(a, b) {
    if (a["age"].length < b["age"].length) return -1;
    else if (a["age"].length > b["age"].length) return 1; 
    else {
        if (a["age"] < b["age"]) return -1;
        else if (a["age"] > b["age"]) return 1;
        return 0;
    }
}


export function trancate(str, length) {
    if (str.length > length)
        str = str.substring(0, 50);
    return str;
}


export function checkInBin(path) {
    if (path == null) return false;
    if (sessionStorage.bin == undefined) return false;
    let arr = JSON.parse(sessionStorage.bin);
    return (arr.find(item => item["path"] == path) == undefined ? false : true); 
}

export function addToBin(path) {
    if (path == null) return;
    if (sessionStorage.bin == undefined) {
        sessionStorage.setItem("bin", JSON.stringify([{
            path,
            count: 1
        }]));
    }
    else {
        let arr = JSON.parse(sessionStorage.bin);
        arr.push({
            path,
            count: 1
        });
        sessionStorage.bin = JSON.stringify(arr);
    }
}

export function setMainSize(min_height = undefined) {
        let head = document.querySelector("header");
        let main = document.querySelector("main");
        let foot = document.querySelector("footer");

        let main_style = main.currentStyle || window.getComputedStyle(main);
        let marginTop = Number(main_style.marginTop.slice(0, -2));
        let marginBottom = Number(main_style.marginBottom.slice(0, -2));
        
        let minHeight = document.body.clientHeight - head.clientHeight - foot.clientHeight - marginTop - marginBottom - 1;
        if (min_height != undefined && minHeight < min_height) minHeight = min_height;
        document.querySelector("main").style.minHeight = `${minHeight}px`;
}