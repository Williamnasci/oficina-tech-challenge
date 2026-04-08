import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login as admin to access restricted endpoints' })
  async login(@Body() loginDto: LoginDto) {
    // Hardcoded simple verification for MVP purposes
    if (loginDto.username === 'admin' && loginDto.password === 'admin') {
      const payload = { sub: 1, role: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
