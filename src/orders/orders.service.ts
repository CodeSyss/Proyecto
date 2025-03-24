import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>, 
  ) {}

  // Agregar producto al carrito (o crear carrito si no existe)
  async create(userId: string, createOrderDto: CreateOrderDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let order = await this.orderModel.findOne({ user: userId });

    if (!createOrderDto.numOrder) {
      throw new BadRequestException('El campo numOrder es requerido');
    }

    if (!order) {
      order = await this.orderModel.create({ user: userId, items: [], numOrder:createOrderDto.numOrder });
    }

    const productIndex = order.items.findIndex(
      (item) => item.product.equals(createOrderDto.productId),
    );

    if (productIndex > -1) {
      order.items[productIndex].quantity += createOrderDto.quantity;
    } else {
      order.items.push({
        product: createOrderDto.productId,
        quantity: createOrderDto.quantity,
      });
    }

    await order.save();
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


