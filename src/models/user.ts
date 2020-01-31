import { Model, ModelConfig } from './model';

export interface AddressInterface {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface CompanyInterface {
  name: string;
  catchPhrase: string;
  bs: string;
}

export class User extends Model {
  name: string;
  username: string;
  email: string;
  address: AddressInterface;
  phone: string;
  website: string;
  company: CompanyInterface;

  static config: ModelConfig = {
    endpoint: '/users',
  };

  constructor(user: User) {
    super(user.id);
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.address = user.address;
    this.phone = user.phone;
    this.website = user.website;
    this.company = user.company;
  }
}
