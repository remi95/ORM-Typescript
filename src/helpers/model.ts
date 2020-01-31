import { Model } from '../models/model';

class ModelHelper {
  static getModelJson<T extends Model>(model: T): string {
    return JSON.parse(JSON.stringify(model))[model.constructor.name.toLowerCase()];
  }
}

export default ModelHelper;
