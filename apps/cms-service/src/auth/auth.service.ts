import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { ContentManager } from '../entities/content-manager.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(ContentManager)  private readonly cmRepo: Repository<ContentManager>) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.cmRepo.findOne({ where: { email } });
        if (!user || !user.is_active) {
            throw new BadRequestException('User not found or not active');
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new BadRequestException('Invalid credentials');
        }
        const token = this.jwtService.sign({ cm_id: user.id });
        user.last_login_at = new Date();
        await this.cmRepo.save(user);
        return {accessToken: token };
    }
}
