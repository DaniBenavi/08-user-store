import { Validators } from '../../../config/validators';

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: string,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = props;

    if (!name) return ['Name is required'];

    // if (!available) return ['Available status is required'];

    // if (price == null) return ['Price is required'];

    // if (typeof price !== 'number' || price < 0)
    //   return ['Price must be a non-negative number'];

    // if (!description) return ['Description is required'];

    if (!user) return ['User is required'];

    if (!Validators.isMongoId(user)) return ['invalid User ID'];

    if (!category) return ['Category is required'];
    if (!Validators.isMongoId(category)) return ['invalid User ID'];

    const dto = new CreateProductDto(
      name,
      available,
      price,
      description,
      user,
      category
    );

    return [undefined, dto];
  }
}
