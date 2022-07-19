"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWikiParagraph = void 0;
/*
page to handle all wiki logic.
*/
var request = require("request");
const cheerio = require('cheerio');
function checkName(name) {
    const patt = /^(\w|\.|-)+$/;
    return patt.test(name);
}
function getWikiHtml(html) {
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
function getWikiObject(articleId, lang) {
    return new Promise((resolve, reject) => {
        var url = `https://${lang}.wikipedia.org/wiki/${articleId}`;
        request(url, function (err, response, body) {
            if (err) {
                var error = "cannot connect to the server";
                reject("<p>Error</p>");
            }
            else {
                const strippedParagraph = getWikiHtml(body);
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
function getWikiParagraph(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var articleId = req.params["articleId"];
        const token = req.get('x-authentication');
        var lang = req.get('Accept-Language').substring(0, 2); // get from header
        if (token != undefined) {
            var url = `http://localhost:3000/users/${token}`;
            request({ url, headers: { "x-authentication": token } }, function (err, response, body) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        var error = "cannot connect to the server";
                    }
                    else {
                        lang = JSON.parse(body)[0].lang; // change if user chose lang.
                        if (checkName(articleId)) {
                            var wikiArticle = yield getWikiObject(articleId, lang);
                            res.send(wikiArticle);
                        }
                        else {
                            var errs = encodeURIComponent('name_containes_illegal_chars');
                            res.redirect('../public/views/404.html/?err=' + errs);
                        }
                    }
                });
            });
        }
        else {
            var errs = encodeURIComponent('no_token_was_given');
            res.redirect('../public/views/404.html/?err=' + errs);
        }
    });
}
exports.getWikiParagraph = getWikiParagraph;
