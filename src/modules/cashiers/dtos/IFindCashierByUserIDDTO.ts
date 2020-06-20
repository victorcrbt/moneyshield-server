export default interface IFindCashierByUserIDDTO {
  user_id: string;
  sorting?: {
    field: 'name' | 'balance';
    order?: 'asc' | 'desc';
  };
}
