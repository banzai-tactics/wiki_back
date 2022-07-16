window.onload = function () {
    alert('hi')
    var url_string: string = window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("name_containes_illegal_chars");
    console.log(c);
    const errtag = document.getElementById('err');
    const err: HTMLElement = errtag!;
    err.innerHTML = c!;

}