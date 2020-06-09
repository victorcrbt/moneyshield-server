import bcrypt from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

import IGenerateHashDTO from '../dtos/IGenerateHashDTO';

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash({ payload }: IGenerateHashDTO): Promise<string> {
    const hashedValue = await bcrypt.hash(payload, 10);

    return hashedValue;
  }
}
