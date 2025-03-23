import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-cart.dto';
import { User } from '../auth/schemas/user.schema'; 

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>, // Inyecta el modelo de usuarios
  ) {}

  // Agregar producto al carrito (o crear carrito si no existe)
  async create(userId: string, createCartDto: CreateCartDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.equals(createCartDto.productId),
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += createCartDto.quantity;
    } else {
      cart.items.push({
        product: createCartDto.productId,
        quantity: createCartDto.quantity,
      });
    }

    await cart.save();
    return cart;
  }

  // Obtener todos los carritos
  async findAll() {
    return await this.cartModel.find().exec();
  }

  // Obtener un carrito por ID de usuario
  async findOne(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new NotFoundException(`Carrito de usuario ${userId} no encontrado`);

    return cart;
  }

  // Actualizar la cantidad de un producto en el carrito
  async update(userId: string, updateCartDto: UpdateCartDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    const item = cart.items.find(
      (item) => item.product.equals(updateCartDto.productId),
    );

    if (!item) throw new NotFoundException('Producto no encontrado en el carrito');

    item.quantity = updateCartDto.quantity ?? item.quantity;
    await cart.save();
    return cart;
  }

  // Eliminar un producto del carrito
  async remove(userId: string, removeCartDto: RemoveFromCartDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    cart.items = cart.items.filter(
      (item) => !item.product.equals(removeCartDto.productId),
    );

    await cart.save();
    return cart;
  }
}
