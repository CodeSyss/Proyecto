import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema'; // Importa el modelo del carrito
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Product } from '../products/schemas/product.schema'; // Importa el modelo de producto

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>, 
    @InjectModel(Cart.name) private cartModel: Model<Cart>, 
    @InjectModel(Product.name) private productModel: Model<Product>, 
  ) {}

  // Crear la orden y actualizar el carrito
  async create(userId: string, createOrderDto: CreateOrderDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    if (cart.isCheckedOut) {
      throw new BadRequestException('El carrito ya ha sido procesado. No se pueden crear órdenes.');
    }

    if (!createOrderDto.numOrder) {
      throw new BadRequestException('El campo numOrder es requerido');
    }

    
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await this.productModel.findById(item.product);
      if (!product) {
        throw new NotFoundException(`Producto no encontrado: ${item.product}`);
      }
      totalAmount += product.price * item.quantity;
    }

    
    const order = await this.orderModel.create({
      user: userId,
      items: cart.items,
      numOrder: createOrderDto.numOrder,
      totalAmount: totalAmount,  
    });

    // Actualizar el carrito y marcarlo como true
    cart.isCheckedOut = true;
    await cart.save();

    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
