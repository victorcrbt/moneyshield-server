import IHashProvider from '../models/IHashProvider';

import IGenerateHashDTO from '../dtos/IGenerateHashDTO';
import ICompareHashDTO from '../dtos/ICompareHashDTO';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash({ payload }: IGenerateHashDTO): Promise<string> {
    return payload;
  }

  public async compareHash({
    payload,
    hash,
  }: ICompareHashDTO): Promise<boolean> {
    return payload === hash;
  }
}
