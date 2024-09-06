let probCheck = 100;
let probRotate = 10;
let probSum = 80;
let probImg = 5;
let probFilt = 10;

let rangeRandomSum = 5000

function random(l, r) {
    return Math.round(Math.random() * (r - l) + l)
}

function doBug(prob) {
    // console.log(random(0, 100))
    return random(0, 100) <= prob;
}

export function checkInBin() {
    if (!doBug(probCheck)) return;
    //console.log("bug!");

    window.location = "profile.html";
    return true;
} 

export function rotateImage(img) {
    bugImage(img);
    if (!doBug(probRotate)) return;
    //console.log("rot");

    img.style.transform = `rotate(${random(30, 300)}deg)`
}

export function bugSum(sum) {
    if (!doBug(probSum)) return sum;
    //console.log("bugSUm");

    return sum + random(-rangeRandomSum, rangeRandomSum)
}

export function bugImage(img) {
    if (!doBug(probImg)) return;
    //console.log("invert")

    img.style.filter = `invert(${random(0, 100)}%)` 
}

export function bugFilter() {
    //console.log("filter")
    return doBug(probFilt)
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function bugInput(input) {
    let str = ""
    let len = input.value.length

    // console.log(len)
    
    for (; len > 0; --len)
        str[len - 1] += characters.charAt(random(0, characters.length))

    input.value = str
}