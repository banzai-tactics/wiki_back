"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWiki = exports.checkName = void 0;
/*
page to handle all wiki logic.
*/
var request = require("request");
const cheerio = require('cheerio');
var query = 'english';
function checkName(name) {
    const patt = /^(\w|\.|-)+$/;
    return patt.test(name);
}
exports.checkName = checkName;
function getHtml(html) {
    let $ = cheerio.load(html);
    var text = "";
    //different lang wiki page has different page structure, but always <p> -> <b>
    $('p > b').each((index, e) => {
        if (index == 0) {
            text = $(e).parent().text().trim();
        }
    });
    return text;
}
function getWiki(articleId, lang) {
    return new Promise((resolve, reject) => {
        var url = `https://${lang}.wikipedia.org/wiki/${articleId}`;
        request(url, function (err, response, body) {
            if (err) {
                var error = "cannot connect to the server";
                reject("<p>Error</p>");
            }
            else {
                const strippedParagraph = getHtml(body);
                var articleObj = {
                    'scrapeDate': Date.now(),
                    'articleName': articleId,
                    'introduction': strippedParagraph
                };
                resolve(articleObj);
            }
        });
    });
}
exports.getWiki = getWiki;
