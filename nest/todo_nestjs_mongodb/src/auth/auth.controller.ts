import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'register new user!' })
  @ApiResponse({ status: 201, description: 'user created successfully' })
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user!' })
  @ApiResponse({ status: 201, description: 'user logged in successfully' })
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto.email, dto.password);
  }
}
