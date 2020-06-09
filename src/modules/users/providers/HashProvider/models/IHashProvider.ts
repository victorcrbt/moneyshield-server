import IGenerateHashDTO from '../dtos/IGenerateHashDTO';

export default interface IHashProvider {
  generateHash(data: IGenerateHashDTO): Promise<string>;
}
