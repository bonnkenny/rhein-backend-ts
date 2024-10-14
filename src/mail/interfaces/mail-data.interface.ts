export interface MailData<T = never> {
  to: string;
  data: T;
}

export interface MailDataWithAccount<T = never> extends MailData<T> {
  account: string;
  password: string;
}
