import { regularExps } from '../../../config/regular-exp';

export class RegisterUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['Name is required', undefined];
    if (!email) return ['Email is required', undefined];
    if (!regularExps.email.test(email)) return ['Email is invalid', undefined];
    if (!password) return ['Password is required', undefined];
    if (password.length < 6)
      return ['Password must be at least 6 characters', undefined];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
