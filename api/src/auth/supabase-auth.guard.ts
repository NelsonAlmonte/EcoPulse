import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, UserResponse } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const accessToken = authHeader.split(' ')[1];
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const authenticatedUser: UserResponse =
      await supabase.auth.getUser(accessToken);

    if (authenticatedUser.error) {
      throw new UnauthorizedException('Token invalido');
    }

    return true;
  }
}
