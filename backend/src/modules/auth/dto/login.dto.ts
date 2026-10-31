import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Nama pengguna wajib diisi' })
  @IsString({ message: 'Nama pengguna harus berupa teks' })
  username: string;

  @IsNotEmpty({ message: 'Kata sandi wajib diisi' })
  @IsString({ message: 'Kata sandi harus berupa teks' })
  @MinLength(6, { message: 'Kata sandi minimal 6 karakter' })
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token wajib disertakan' })
  @IsString()
  refresh_token: string;
}

