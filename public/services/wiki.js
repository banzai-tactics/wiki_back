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
const WikiObject_1 = require("./WikiObject");
/*
page to handle all wiki logic.
*/
var request = require("request");
const cheerio = require('cheerio');
const db = require('../db/queries');
function isValidName(name) {
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
function test() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function getWikiObject(articleId, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        var url = `https://${lang}.wikipedia.org/wiki/${articleId}`;
        const data = yield fetch(url).then(response => {
            return response.text();
        }).then(data => {
            const strippedParagraph = getWikiHtml(data);
            const articleObj = new WikiObject_1.WikiObject(Date.now(), articleId, strippedParagraph);
            return articleObj;
        });
        return data;
    });
}
function getWikiParagraph(articleId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (token != undefined) {
                const user = yield db.getUserById(token); //TODO: add User type
                const lang = user.lang;
                if (isValidName(articleId)) {
                    const wikiArticle = yield getWikiObject(articleId, lang);
                    return (wikiArticle);
                }
                else {
                    var errs = encodeURIComponent('name_containes_illegal_chars');
                    throw errs;
                }
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getWikiParagraph = getWikiParagraph;
