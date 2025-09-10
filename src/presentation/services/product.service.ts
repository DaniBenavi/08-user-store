import { ProductModel } from '../../data/mongo/models/product.model';
import { CreateProductDto } from '../../domain/dtos/products/create-product.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CustomError } from '../../domain/errors/custom.error';

export class ProductService {
  constructor() {}

  // creando un producto
  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    });

    if (productExists) throw new Error('Product already exists');

    try {
      const product = new ProductModel({
        ...createProductDto,
      });

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error} `);
    }
  }
  // obteniendo productos con paginacion
  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'name email')
          .populate('category', 'name description'),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
