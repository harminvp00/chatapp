/**
 * UserError : this class is used to indicate the error about the user like when user already created or when user does not exists
 */
export class UserError extends Error {
  code = "";
  constructor(message = "user is not exists", code = "") {
    super(message);
    this.name = "UserError";
    this.code = code;
  }
}

/**
 * UnauthorizedAccess: to throw an error whenever the user has recognize an unauthorize like missing token or roles
 */
export class UnauthorizedAccess extends Error {
  constructor(message = "Unauthrozied access detected.") {
    super(message);
    this.name = "UnauthorizedAccess";
  }
}

/**
 * PasswordError: when ever user password does not match with current password
 */
export class PasswordError extends Error {
  constructor(message = "wrong credentials") {
    super(message);
    this.name = "PasswordError";
  }
}

/**
 * TokenError: this is for when system recognize missing refresh token or missing access token
 */
export class TokenError extends Error {
  constructor(message = "Token is not found") {
    super(message);
    this.name = "TokenError";
  }
}

/**
 * UserSession: whenever the session is missing or session not created
 */
export class UserSession extends Error {
  constructor(message = "unable to create user sessions") {
    super(message);
    this.name = "UserSession";
  }
}
