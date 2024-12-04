import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard extends AuthGuard(['jwt']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic === undefined) {
      isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getClass());
    }

    console.log('JwtGuard -> canActivate -> isPublic', isPublic);
    console.log(
      'JwtGuard -> canActivate -> context.getHandler()',
      this.reflector,
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
