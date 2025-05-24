import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });
    console.log(user);
    return { message: 'user created successfully!' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .select('password _id role');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    console.log(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user._id, email: user.email, role: user.role };
    console.log(user);
    const access_token = await this.jwtService.signAsync(payload);
    return {
      message: 'user loggedin successfully!',
      data: {
        access_token,
      },
    };
  }
}
