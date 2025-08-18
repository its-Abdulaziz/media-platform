import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ContentManager } from '../entities/content-manager.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    @InjectRepository(ContentManager) private cmRepo: Repository<ContentManager>
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    console.log(token);
    if (!token) {
      return false;
    }
    const split = token.split(' ');
    const jwt = split[1];
    try {
      const decoded = this.jwtService.verify(jwt);
      const cm = this.cmRepo.findOne({ where: { id: decoded.cm_id } });
      if (!cm) {
        return false;
      }
      request.user = {cm_id: decoded.cm_id};
      return true;
    } catch (error) {
      return false; 
    }
  }
}
