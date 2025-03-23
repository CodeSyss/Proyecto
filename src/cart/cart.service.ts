import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-cart.dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  // Agrega un producto al carrito (o crear carrito si no existe) 
  // Falta arreglar el userId ya que recibe cualquier cosa. 
  async create(userId: Types.ObjectId, createCartDto: CreateCartDto) {
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

  // Get todos los carritos
  async findAll() {
    return await this.cartModel.find().exec();
  }

  // Get un carrito por id de usuario
  async findOne(userId: Types.ObjectId) {
    const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new NotFoundException(`Carrito de usuario ${userId} no encontrado`);
    return cart;
  }

  // Actualiza la cantidad de un producto en el carrito
  async update(userId: Types.ObjectId, updateCartDto: UpdateCartDto) {
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

  // Elimina un producto del carrito
  async remove(userId: Types.ObjectId, removeCartDto: RemoveFromCartDto) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    cart.items = cart.items.filter(
      (item) => !item.product.equals(removeCartDto.productId),
    );

    await cart.save();
    return cart;
  }
}
