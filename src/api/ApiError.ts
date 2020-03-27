export class ApiError extends Error {
  constructor(
    public status: number = 500,
    public code: string,
    public message: string = code
  ) {
    super(message);
  }
}
