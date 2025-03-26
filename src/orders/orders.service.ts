import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { User } from '../auth/schemas/user.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Neo4jService } from '../database/neo4j/neo4j.service';


@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly neo4jService: Neo4jService,
  ) {}


  async create(userId: string, createOrderDto: CreateOrderDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }


    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }


    const { cartId } = createOrderDto;
    if (!Types.ObjectId.isValid(cartId)) {
      throw new BadRequestException('El ID del carrito no es válido');
    }


    const cart = await this.cartModel.findById(cartId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío o no existe');
    }


    // Generar número de orden único con año + secuencia
    const year = new Date().getFullYear();
    const lastOrder = await this.orderModel.findOne({ numOrder: { $regex: `^${year}` } }).sort({ numOrder: -1 });
    const lastSequence = lastOrder ? parseInt(lastOrder.numOrder.slice(4)) : 0;
    const numOrder = `${year}${(lastSequence + 1).toString().padStart(3, '0')}`;


    const order = await this.orderModel.create({
      user: userId,
      cart: cartId,
      numOrder,
      status: 'pending',
    });
   
    // Registrar la orden en Neo4j
    const session = await this.neo4jService.getSession();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})
        CREATE (o:Order {id: $orderId, numOrder: $numOrder, status: 'pending'})
        CREATE (u)-[:PLACED_ORDER]->(o)
        `,
        {
          userId,
          orderId: (order._id as Types.ObjectId).toString(),
          numOrder,
        }
      );
    } finally {
      await session.close();
    }


    return order;
  }


  async findAll() {
    return this.orderModel.find().populate('user').populate('cart').exec();
  }


  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID de la orden no es válido');
    }


    const order = await this.orderModel.findById(id).populate('user').populate('cart').exec();
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }


    return order;
  }
}
