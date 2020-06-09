import IHashProvider from '../models/IHashProvider';

import IGenerateHashDTO from '../dtos/IGenerateHashDTO';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash({ payload }: IGenerateHashDTO): Promise<string> {
    return payload;
  }
}
