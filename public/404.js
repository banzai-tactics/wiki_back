"use strict";
window.onload = function () {
    alert('hi');
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("name_containes_illegal_chars");
    console.log(c);
    const errtag = document.getElementById('err');
    const err = errtag;
    err.innerHTML = c;
};
