export default interface ICreateCashierDTO {
  user_id: string;
  name: string;
  is_bank_account?: boolean;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account?: string | null;
  account_type?: 'savings' | 'checking' | 'not_applied' | null;
  balance?: number;
}
