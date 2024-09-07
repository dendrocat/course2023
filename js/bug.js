let probCheck = 100;
let probRotate = 10;
let probCount = 70;
let probImg = 5;
let probFilt = 10;

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

export function bugCount(count) {
    if (!doBug(probCount)) return count;
    //console.log("bugSUm");

    return count + 1
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
    if (input.value.length == 0) return;
    input.value = input.value.slice(0, -1) + characters[random(0, characters.length - 1)]
}