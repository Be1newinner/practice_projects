import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './utils/jwt';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';

export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDTO) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
    });
    console.log(user);
    return { message: 'user created successfully!' };
  }

  async validateUser(dto: LoginDTO) {
    const user = await this.userModel
      .findOne({
        email: dto.email,
      })
      .select('password _id role');
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    console.log(user);
    return user;
  }

  async login(dto: LoginDTO) {
    const user = await this.validateUser(dto);
    const access_token = this.tokenService.generateToken({
      id: user._id as string,
      email: user.email,
      role: user.role,
    });
    return {
      message: 'user loggedin successfully!',
      data: {
        access_token,
      },
    };
  }
}
