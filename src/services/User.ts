export class User {
    username: string;
    lang: string;
    token: string;

    constructor(username:string, lang:string,token:string){
        this.username = username;
        this.lang = lang;
        this.token = token;
    }
}