// A typed error that carries an HTTP status code.
// Services throw this when a business rule fails; the central error
// middleware reads `statusCode` to build the right HTTP response.

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
