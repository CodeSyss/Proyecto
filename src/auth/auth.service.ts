import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {User} from './schemas/user.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import {hash, compare} from  'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class authService {
  constructor(@InjectModel(User.name) private authModel: Model<User>,
  private jwtService:JwtService
) {}

  
  async create(createAuthDto: CreateAuthDto) {
    //const createAuth = new this.authModel(createAuthDto);
    const {password} =createAuthDto; //Pasword 1234
    const plainToHash= await hash(password, 10); //Password $#fwef
    createAuthDto={...createAuthDto, password:plainToHash};

    return this.authModel.create(createAuthDto);
    //return createAuth.save();
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

  async login(userObjectLogin:LoginDto){
    const{username, password}= userObjectLogin;
    const findUser = await this.authModel.findOne({username});
    if(!findUser) throw new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(password, findUser.password);
    if(!checkPassword) throw new HttpException('PASSWORD_INVALID', 403);
    
    const payload= {id:findUser._id, name: findUser.name};
    const token= this.jwtService.sign(payload);

    const data={
      user:findUser,
      token
    };
    return data;


  }
}
