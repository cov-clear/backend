export const defaultStatusMessages: { [key: string]: string } = {
  404: 'Not found',
  500: 'Internal server error',
};

export class ApiError extends Error {
  constructor(
    public status: number = 500,
    public message: string = defaultStatusMessages[500]
  ) {
    super(message);
  }
}
