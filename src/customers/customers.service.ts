import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {Customer} from './squemas/customer.squema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CustomersService {
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
