import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { authService } from './auth.service';
import { CreateCustomerDto } from './dto/create-auth.dto';
import { UpdateCustomerDto } from './dto/update-auth.dto';

@Controller('auth')
export class authController {
  constructor(private readonly authService: authService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.authService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.authService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
