export class WikiObject {
    scrapeDate: number;
    articleName: string;
    introduction: string;

    constructor(scrapeDate:number, articleName:string,introduction:string){
        this.scrapeDate = scrapeDate;
        this.articleName = articleName;
        this.introduction = introduction;
    }
}