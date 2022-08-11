import { WikiObject } from "./WikiObject";

/*
page to handle all wiki logic.
*/
var request: any = require("request");
const cheerio = require('cheerio');
const db = require('../db/queries');

function isValidName(name: string) {
	const patt: any = /^(\w|\.|-)+$/;
	return patt.test(name);
}

function getWikiHtml(html: string) {
	let $ = cheerio.load(html);
	var text: string = "";
	//different lang wiki page has different page structure, but always <p> -> <b>
	$('p > b').each((index: any, e: any) => {
		if (index == 0) {
			text = $(e).parent().text().trim();
		}
	})
	return text;
}


async function getWikiObject(articleId: string, lang: string): Promise<any> {
	var url: string = `https://${lang}.wikipedia.org/wiki/${articleId}`;
	const data = await fetch(url).then(response => {
		return response.text();
	}).then(data => {
		const strippedParagraph = getWikiHtml(data);
		const articleObj = new WikiObject(Date.now(), articleId, strippedParagraph);
		return articleObj;
	});
	return data;
}

export async function getWikiParagraph(articleId: string, token: string) {
	try {
		if (token != undefined) {
			console.log(token);
			const user = await db.getUserByIdTypeORM(token); //TODO: add User type
			console.log(user);
			const lang = user.lang;
			if (isValidName(articleId)) {
				const wikiArticle = await getWikiObject(articleId, lang);
				await db.addSearchTypeORM(user,articleId);
				return (wikiArticle);
			} else {
				var errs = encodeURIComponent('name_containes_illegal_chars');
				throw errs;
			}
		}
	} catch (error) {
		throw error;
	}

}