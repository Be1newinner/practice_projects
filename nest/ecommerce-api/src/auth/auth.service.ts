import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.exists({ email: dto.email });
    if (user) throw new UnauthorizedException('Email already ergistered!');

    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashed,
    });

    return this.generateToken(newUser);
  }

  async login(dto: LoginDto) {}

  generateToken(user: any) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
