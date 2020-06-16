export default interface IParseMailTemplateDTO {
  file: string;
  variables?: {
    [key: string]: string | number | boolean;
  };
}
