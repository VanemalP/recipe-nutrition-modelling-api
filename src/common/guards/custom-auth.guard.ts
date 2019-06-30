import { AuthService } from './../../auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuardWithBlackisting extends AuthGuard('jwt') implements CanActivate {
  public constructor(private readonly authService: AuthService) { super(); }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!super.canActivate(context)) {
      return false;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }

    const isTokenBlacklisted = await this.authService.isTokenBlacklisted(token);
    if (isTokenBlacklisted) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
