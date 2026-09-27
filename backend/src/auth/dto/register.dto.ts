import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
  @MaxLength(72, { message: 'Пароль должен быть не длиннее 72 символов' })
  password!: string;

  @IsString()
  @MinLength(3, {
    message: 'Имя пользователя должно быть не короче 3 символов',
  })
  @MaxLength(24, {
    message: 'Имя пользователя должно быть не длиннее 24 символов',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Имя пользователя может содержать только буквы, цифры и _',
  })
  username!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'Имя должно быть не длиннее 80 символов' })
  name?: string;
}
