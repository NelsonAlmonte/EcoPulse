import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new UnauthorizedException();

    return {
      user: data.user,
      token: data.session.access_token,
    };
  }
}
