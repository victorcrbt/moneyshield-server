import IGenerateHashDTO from '../dtos/IGenerateHashDTO';
import ICompareHashDTO from '../dtos/ICompareHashDTO';

export default interface IHashProvider {
  generateHash(data: IGenerateHashDTO): Promise<string>;
  compareHash(data: ICompareHashDTO): Promise<boolean>;
}
