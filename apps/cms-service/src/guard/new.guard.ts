import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ContentManager } from '../entities/content-manager.entity';

@Injectable()
export class NewAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    private cmRepo: Repository<ContentManager>
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    if (!token) {
      return false;
    }
    try {
      const decoded = this.jwtService.verify(token);
      const cm = this.cmRepo.findOne({ where: { id: decoded.cm_id } });
      if (!cm) {
        return false;
      }
      request.user = cm;
      return true;
    } catch (error) {
      return false; 
    }
  }
}
