/*
page to handle all wiki logic.
*/
var request: any = require("request");
const cheerio = require('cheerio');

function checkName(name: string) {
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

function getWikiObject(articleId: string, lang: string): Promise<any> {
	return new Promise((resolve, reject) => {
		var url: string = `https://${lang}.wikipedia.org/wiki/${articleId}`;
		request(url, function (err: any, response: any, body: any) {
			if (err) {
				var error = "cannot connect to the server";
				reject("<p>Error</p>");
			} else {
				const strippedParagraph = getWikiHtml(body);
				var articleObj = {
					'scrapeDate': Date.now(),
					'articleName': articleId,
					'introduction': strippedParagraph
				}
				resolve(articleObj);
			}
		});
	})
}


export async function getWikiParagraph(req: any, res: any) {
	var articleId: string = req.params["articleId"];
	const token = req.get('x-authentication');
	var lang = req.get('Accept-Language').substring(0, 2) // get from header
	if (token != undefined) {
		var url: string = `http://localhost:3000/users/${token}`;
		request({ url, headers: { "x-authentication": token } }, async function (err: any, response: any, body: any) {
			if (err) {
				var error = "cannot connect to the server";
			} else {
				lang = JSON.parse(body)[0].lang; // change if user chose lang.
				if (checkName(articleId)) {
					var wikiArticle = await getWikiObject(articleId, lang);
					res.send(wikiArticle);
				} else {
					var errs = encodeURIComponent('name_containes_illegal_chars');
					res.redirect('../public/views/404.html/?err=' + errs);
				}
			}
		});
	} else {
		var errs = encodeURIComponent('no_token_was_given');
		res.redirect('../public/views/404.html/?err=' + errs);
	}
}