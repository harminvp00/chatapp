

export class URINotFound extends Error{
    constructor(message = "URI is not found"){
        super(message);
        this.name = "URINotFound";
    }
}


export class DBNotConnect extends Error{
    constructor(message = "DATABASE is unable to connect"){
        super(message);
        this.name = "DBNotConnect";
    }
}