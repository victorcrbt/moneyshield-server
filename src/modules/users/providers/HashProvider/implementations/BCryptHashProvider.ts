import bcrypt from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

import IGenerateHashDTO from '../dtos/IGenerateHashDTO';
import ICompareHashDTO from '../dtos/ICompareHashDTO';

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash({ payload }: IGenerateHashDTO): Promise<string> {
    const hashedValue = await bcrypt.hash(payload, 10);

    return hashedValue;
  }

  public async compareHash({
    payload,
    hash,
  }: ICompareHashDTO): Promise<boolean> {
    return bcrypt.compare(payload, hash);
  }
}
