

export class UserNotFound extends Error{
    constructor(message = "user is not exists"){
        super(message);
        this.name = "UserNotFound";
    }
}