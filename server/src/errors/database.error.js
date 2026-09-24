/**
 * Database Errors:
 * Actually first two error are server isseus if the DB not connect or If DB URI will not found
 */
export class URINotFound extends Error {
  constructor(message = "URI is not found") {
    super(message);
    this.name = "DB_URI_MISSING";
  }
}

export class DBNotConnect extends Error {
  constructor(message = "DATABASE is unable to connect") {
    super(message);
    this.name = "DB_CONNECT_ERROR";
  }
}

export class MissingField extends Error {
  constructor(message = "Missing a field") {
    super(message);
    this.name = "MISSING_FIELD";
  }
}

export class OperationNotFound extends Error {
  constructor(message = "No operation are found like provided") {
    super(message);
    this.name = "OPERATION_NOT_FOUND";
  }
}
