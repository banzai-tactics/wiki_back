/*
page to handle all wiki logic.
*/
var request: any = require("request");
const cheerio = require('cheerio');

var query: string = 'english';


export function checkName(name: string) {
	const patt: any = /^(\w|\.|-)+$/;
	return patt.test(name);
}

function getHtml(html: string) {
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


export function getWiki(articleId: string, lang:string): Promise<any> {
	return new Promise((resolve, reject) => {
		var url: string = `https://${lang}.wikipedia.org/wiki/${articleId}`;
		request(url, function (err: any, response: any, body: any) {
			if (err) {
				var error = "cannot connect to the server";
				reject("<p>Error</p>");
			} else {
				const strippedParagraph = getHtml(body);
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