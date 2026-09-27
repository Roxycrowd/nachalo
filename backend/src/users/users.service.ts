import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SessionUser, toSessionUser } from './session-user';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  username: string;
  name?: string;
}

export interface AuthRecord {
  userId: string;
  passwordHash: string;
}

const userWithCredential = {
  credential: {
    select: { email: true },
  },
} satisfies Prisma.UserInclude;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<SessionUser> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim().toLowerCase();

    const [emailTaken, usernameTaken] = await Promise.all([
      this.prisma.credential.findUnique({
        where: { email },
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { username },
        select: { id: true },
      }),
    ]);

    if (emailTaken) {
      throw new ConflictException('Этот email уже зарегистрирован');
    }
    if (usernameTaken) {
      throw new ConflictException('Это имя пользователя уже занято');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          name: blankToNull(input.name),
          credential: {
            create: {
              email,
              passwordHash: input.passwordHash,
            },
          },
        },
        include: userWithCredential,
      });
      return toSessionUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email или имя пользователя уже заняты');
      }
      throw error;
    }
  }

  async getAuthRecordByEmail(email: string): Promise<AuthRecord | null> {
    const credential = await this.prisma.credential.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { userId: true, passwordHash: true },
    });
    if (!credential) {
      return null;
    }
    return { userId: credential.userId, passwordHash: credential.passwordHash };
  }

  async getSession(userId: string): Promise<SessionUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: userWithCredential,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return toSessionUser(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<SessionUser> {
    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = blankToNull(dto.name);
    if (dto.age !== undefined) data.age = dto.age;
    if (dto.city !== undefined) data.city = blankToNull(dto.city);
    if (dto.avatar !== undefined) data.avatar = blankToNull(dto.avatar);
    if (dto.bio !== undefined) data.bio = blankToNull(dto.bio);

    try {
      await this.prisma.user.update({ where: { id: userId }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Пользователь не найден');
      }
      throw error;
    }

    return this.getSession(userId);
  }
}

function blankToNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}
