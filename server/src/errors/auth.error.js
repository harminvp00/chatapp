
export class UserError extends Error {
  constructor(message = "user is not exists") {
    super(message);
    this.name = "UserError";
  }
}

export class UnauthorizedAccess extends Error {
  constructor(message = "Unauthrozied access detected.") {
    super(message);
    this.name = "UnauthorizedAccess";
  }
}


export class PasswordError extends Error {
  constructor(message = "wrong credentials") {
    super(message);
    this.name = "PasswordError";
  }
}