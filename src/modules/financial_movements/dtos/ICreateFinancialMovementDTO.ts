export default interface ICreateFinancialMovementDTO {
  cashier_id: string;
  description: string;
  type: 'income' | 'outcome';
  due_date: Date;
  value: number;
  status?: 'pending' | 'paid_out';
}
