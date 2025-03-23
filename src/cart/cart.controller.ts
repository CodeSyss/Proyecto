import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-cart.dto';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  create(@Param('userId') userId: Types.ObjectId,  @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(userId, createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: Types.ObjectId) {
    return this.cartService.findOne(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: Types.ObjectId, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(userId, updateCartDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: Types.ObjectId, @Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.remove(userId, removeFromCartDto);
  }
}

