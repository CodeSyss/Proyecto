import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-auth.dto';
import { UpdateCustomerDto } from './dto/update-auth.dto';
import {Customer} from './squemas/user.squema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class authService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const createCustomer = new this.customerModel(createCustomerDto);
    return createCustomer.save();
  }

  async findAll() {
    return this.customerModel.find().exec();
  }

  async findOne(id: string) {
    return this.customerModel.findById(id).exec();
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customerModel
    .findByIdAndUpdate(id, updateCustomerDto, { new: true })
    .exec();
  }

  async remove(id: string) {
    return this.customerModel.findByIdAndDelete(id).exec();
  }
}
