export default interface IFindFinancialMovementByUserIDDTO {
  user_id: string;
  status?: 'pending' | 'paid_out';
  sorting?: {
    field: 'due_date' | 'value';
    order?: 'asc' | 'desc';
  };
}
