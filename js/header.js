document.querySelector("#navi").onchange = function() {
    if (this.checked) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "none";
}
