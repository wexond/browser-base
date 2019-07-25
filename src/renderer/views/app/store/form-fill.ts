import { Database } from '~/models/database';
import { IFormFillData } from '~/interfaces';

export class FormFillStore {
  public db = new Database<IFormFillData>('formfill');
}
