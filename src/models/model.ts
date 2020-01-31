import { NonFunctionKeys } from 'utility-types';
import Request from '../helpers/request';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

export enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

export enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

/**
 * Define the configuration of a relation
 */
export interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  model: any;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

export interface ModelConfig {
  /** The endpoint on the remote API, example 'users' */
  endpoint: string;

  /** The definition of the relations */
  relations?: Record<string, Relation>;
}

interface ModelClass<T extends Model> {
  config: ModelConfig;
  new(data: T): T;
}

export abstract class Model {
  protected static config: ModelConfig;
  id: string | number;

  protected constructor(id: string | number) {
    this.id = id;
  }

  get modelClass(): typeof Model {
    return this.constructor as typeof Model;
  }

  static async create<T extends Model>(this: ModelClass<T>, dataOrModel: SchemaOf<T> | T): Promise<T> {
    const data = await Request.create(this.config.endpoint, JSON.stringify(dataOrModel));
    return new this(data);
  }

  /**
   * Find all elements of given entity, with eventual filters.
   */
  static async find<T extends Model>(this: ModelClass<T>, filter?: QueryFilter): Promise<T[]> {
    let url = this.config.endpoint;

    if (filter) {
      const {
        where, limit, page, sort, order,
      } = filter;
      const params: string[] = [];

      if (where) {
        for (const key in where) {
          if (Object.prototype.hasOwnProperty.call(where, key)) {
            params.push(`${key}=${where[key]}`);
          }
        }
      }
      if (limit) params.push(`_limit=${filter.limit}`);
      if (page) params.push(`_page=${filter.page}`);
      if (sort) params.push(`_sort=${filter.sort}`);
      if (order) params.push(`_order=${filter.order}`);

      url = `${url}?${params.join('&')}`;
    }

    const data = await Request.getData(url);

    return data.map((model: T) => new this(model));
  }

  /**
   * Find a specific entity by his ID.
   *
   * @param id
   *   Entity ID.
   * @param options
   *   Optional relations.
   */
  static async findById<T extends Model>(this: ModelClass<T>, id: ModelIdType, options?: FindByIdOptions): Promise<T> {
    const data = await Request.getData(`${this.config.endpoint}/${id}`);

    const { relations } = this.config;

    if (options && options.includes.length > 0) {
      const relationKeys = options.includes.filter((option) => (
        this.config.relations && option in this.config.relations));

      await Promise.all(
        relationKeys.map(async (option) => {
          if (relations && option in relations) {
            const relation = relations[option];

            switch (relation.type) {
              case RelationType.BelongsTo:
                data[option] = await relation.model.findById(data[relation.foreignKey]);
                break;
              case RelationType.HasMany:
                data[option] = await relation.model.find({ where: { [relation.foreignKey]: id } });
                break;
              default:
                break;
            }
          }

          return null;
        }),
      );
    }

    return new this(data);
  }

  static async updateById<T extends Model>(this: ModelClass<T>, model: T): Promise<T>;
  static async updateById<T extends Model>(this: ModelClass<T>, id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T[]>;
  static async updateById<T extends Model>(this: ModelClass<T>, model: T | ModelIdType, data?: Partial<SchemaOf<T>>): Promise<T> {
    if (model instanceof this) {
      const data = await Request.update(`${this.config.endpoint}/${model.id}`, JSON.stringify(model));
      return new this(data);
    }

    const patch = await Request.patch(`${this.config.endpoint}/${model}`, JSON.stringify(model));
    return new this(patch);
  }

  /**
   * Delete an entity by his ID.
   *
   * @param id
   */
  static async deleteById(id: ModelIdType): Promise<boolean> {
    const success = await Request.deleteData(`${this.config.endpoint}/${id}`);
    return success;
  }

  /**
   * Push changes that has occurred on the instance
   */
  async save<T extends Model>(this: T): Promise<T> {
    await Request.update(`${this.modelClass.config.endpoint}/${this.id}`, JSON.stringify(this));
    return this;
  }

  /**
   * Push given changes, and update the instance
   */
  async update<T extends Model>(this: T, data: Partial<SchemaOf<T>>): Promise<T> {
    await Request.patch(`${this.modelClass.config.endpoint}/${this.id}`, JSON.stringify(data));
    return this;
  }

  /**
   * Remove the remote data
   */
  async remove(): Promise<boolean> {
    const success = await Request.deleteData(`${this.modelClass.config.endpoint}/${this.id}`);
    return success;
  }
}
