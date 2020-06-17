interface ErrorProperties {
  status: number;
  message: string;
}

export default class AppError {
  public readonly status: number;

  public readonly message: string;

  constructor({ status = 400, message }: ErrorProperties) {
    this.message = message;
    this.status = status;
  }
}
