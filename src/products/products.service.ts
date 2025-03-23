import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {Product} from './squemas/product.squema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private ProductModel: Model<Product>) {}
  async create(createProductDto: CreateProductDto) {
    const createProduct = new this.ProductModel(createProductDto);
    return createProduct.save();
  }

  async findAll() {
    return this.ProductModel.find().exec();
  }

  async findOne(id: string) {
    return this.ProductModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.ProductModel
    .findByIdAndUpdate(id, updateProductDto, { new: true })
    .exec();
  }

  async remove(id: string) {
    return this.ProductModel.findByIdAndDelete(id).exec();
  }
}
