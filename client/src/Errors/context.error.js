

export class contextNotExist extends Error{
    constructor(message = "context must be used inside in the Auth Provide!"){
        super(message);
        this.name = "contextNotExist";
    }
}