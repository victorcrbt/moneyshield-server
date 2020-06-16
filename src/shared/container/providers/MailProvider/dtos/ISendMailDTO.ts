interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  from?: IMailContact;
  to: IMailContact;
  subject: string;
  content?: string;
  templateData: {
    file: string;
    variables?: {
      [key: string]: string | number | boolean;
    };
  };
}
