
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