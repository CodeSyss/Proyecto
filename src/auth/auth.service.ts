import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {User} from './schemas/user.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class authService {
  constructor(@InjectModel(User.name) private authModel: Model<User>) {}
  async create(createAuthDto: CreateAuthDto) {
    const createAuth = new this.authModel(createAuthDto);
    return createAuth.save();
  }

  async findAll() {
    return this.authModel.find().exec();
  }

  async findOne(id: string) {
    return this.authModel.findById(id).exec();
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    return this.authModel
    .findByIdAndUpdate(id, updateAuthDto, { new: true })
    .exec();
  }

  async remove(id: string) {
    return this.authModel.findByIdAndDelete(id).exec();
  }
}
