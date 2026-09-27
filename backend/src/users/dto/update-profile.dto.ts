import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'Имя должно быть не длиннее 80 символов' })
  name?: string | null;

  @IsOptional()
  @IsInt({ message: 'Возраст должен быть числом' })
  @Min(13, { message: 'Возраст должен быть не меньше 13' })
  @Max(120, { message: 'Возраст должен быть не больше 120' })
  age?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'Город должен быть не длиннее 80 символов' })
  city?: string | null;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Аватар должен быть ссылкой http или https' },
  )
  avatar?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Описание должно быть не длиннее 500 символов' })
  bio?: string | null;
}
