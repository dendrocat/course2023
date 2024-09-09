let probCheck = 100;
let probRotate = 10;
let probCount = 70;
let probImg = 5;
let probFilt = 10;

function random(l, r) {
    return Math.round(Math.random() * (r - l) + l)
}

function doBug(prob) {
    return random(0, 100) <= prob;
}

export function checkInBin() {
    if (!doBug(probCheck)) return;

    window.location = "profile.html";
    return true;
} 

export function rotateImage(img) {
    bugImage(img);
    if (!doBug(probRotate)) return;

    img.style.transform = `rotate(${random(30, 300)}deg)`
}

export function bugCount(count) {
    if (!doBug(probCount)) return count;

    return count + 1
}

export function bugImage(img) {
    if (!doBug(probImg)) return;

    img.style.filter = `invert(${random(0, 100)}%)` 
}

export function bugFilter() {
    return doBug(probFilt)
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-=?[]()';
const ignore = '@.';

function ignoreChar(char) {
    for (let el of ignore)
        if (char == el) return true;

    return false;
}

export function bugInput(input) {
    if (input.value.length == 0) return;
    if (ignoreChar(input.value[input.value.length - 1])) return;
    input.value = input.value.slice(0, -1) + characters[random(0, characters.length - 1)]
}