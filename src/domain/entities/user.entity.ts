import { CustomError } from '../errors/custom.error';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly password: string,
    public readonly role: string[],
    public readonly img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!id && _id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) {
      throw CustomError.badRequest('Missing name');
    }

    if (!email) {
      throw CustomError.badRequest('Missing email');
    }

    if (emailValidated === undefined) {
      throw CustomError.badRequest('Missing emailValidated');
    }

    if (!password) {
      throw CustomError.badRequest('Missing password');
    }

    if (!role) {
      throw CustomError.badRequest('Missing role');
    }

    return new UserEntity(
      id || _id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
