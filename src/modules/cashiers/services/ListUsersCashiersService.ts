import { Cashier } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import ICashiersRepository from '../repositories/ICashiersRepository';

interface IRequestDTO {
  user_id: string;
  sorting?: {
    field: 'name' | 'balance';
    order?: 'asc' | 'desc';
  };
}

@injectable()
export default class ListUsersCashiersService {
  constructor(
    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({ user_id, sorting }: IRequestDTO): Promise<Cashier[]> {
    const cashiers = await this.cashiersRepository.findByUserID({
      user_id,
      sorting,
    });

    return cashiers;
  }
}
