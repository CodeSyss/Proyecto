import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-cart.dto';
import { User } from '../auth/schemas/user.schema'; 
import { Neo4jService } from '../database/neo4j/neo4j.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>, 
    private readonly neo4jService: Neo4jService, 
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

    // Registrar la relación en Neo4j
    const session = await this.neo4jService.getSession();
    try {
      await session.run(
        `
        MERGE (u:User {id: $userId})
        MERGE (p:Product {id: $productId})
        MERGE (u)-[r:ADDED_TO_CART]->(p)
        ON CREATE SET r.quantity = $quantity
        ON MATCH SET r.quantity = r.quantity + $quantity
        `,
        {
          userId,
          productId: createCartDto.productId,
          quantity: createCartDto.quantity,
        }
      );
    } finally {
      await session.close();
    }

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

    // Actualizar la cantidad en Neo4j
    const session = await this.neo4jService.getSession();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})-[r:ADDED_TO_CART]->(p:Product {id: $productId})
        SET r.quantity = $quantity
        `,
        {
          userId,
          productId: updateCartDto.productId,
          quantity: updateCartDto.quantity,
        }
      );
    } finally {
      await session.close();
    }

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

    // Eliminar la relación en Neo4j
    const session = await this.neo4jService.getSession();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})-[r:ADDED_TO_CART]->(p:Product {id: $productId})
        DELETE r
        `,
        {
          userId,
          productId: removeCartDto.productId,
        }
      );
    } finally {
      await session.close();
    }

    return cart;
  }
}
