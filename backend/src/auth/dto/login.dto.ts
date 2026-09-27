import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
  @MaxLength(72)
  password!: string;
}
