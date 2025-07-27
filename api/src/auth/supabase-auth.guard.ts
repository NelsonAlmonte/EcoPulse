import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwks = createRemoteJWKSet(
    new URL(`${process.env.PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(accessToken, this.jwks, {
        algorithms: ['ES256'],
      });

      if (payload.aud !== 'authenticated') throw new UnauthorizedException();

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
