import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { ActivityLog } from '../users/entities/activity-log.entity';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role')
      .where('user.username = :username', { username: loginDto.username })
      .andWhere('user.is_deleted = false')
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Nama pengguna atau kata sandi yang Anda masukkan salah.',
        },
      });
    }

    if (!user.is_active) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'Akun Anda dinonaktifkan. Silakan hubungi Administrator Sistem.',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Nama pengguna atau kata sandi yang Anda masukkan salah.',
        },
      });
    }

    const roles = user.user_roles?.map((ur) => ur.role.role_code) || [];

    // Payload JWT
    const payload = {
      sub: user.id,
      username: user.username,
      full_name: user.full_name,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshTokenString = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Simpan hash refresh token
    const tokenHash = await bcrypt.hash(refreshTokenString, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      revoked: false,
    });

    // Update last_login_at
    await this.userRepository.update(user.id, { last_login_at: new Date() });

    // Catat log aktivitas login
    await this.activityLogRepository.save({
      user_id: user.id,
      action: 'LOGIN',
      entity_type: 'users',
      entity_id: user.id,
      detail: { username: user.username },
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshTokenString,
      expires_in: 3600,
      user: {
        id: user.id,
        user_code: user.user_code,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        roles,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let decoded: any;
    try {
      decoded = this.jwtService.verify(dto.refresh_token);
    } catch {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token tidak valid atau telah kedaluwarsa.',
        },
      });
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.sub, is_active: true, is_deleted: false },
      relations: ['user_roles', 'user_roles.role'],
    });

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Pengguna tidak ditemukan.',
        },
      });
    }

    const roles = user.user_roles?.map((ur) => ur.role.role_code) || [];
    const payload = {
      sub: user.id,
      username: user.username,
      full_name: user.full_name,
      roles,
    };

    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      access_token: newAccessToken,
      expires_in: 3600,
    };
  }

  async logout(userId: number) {
    await this.refreshTokenRepository.update(
      { user_id: userId, revoked: false },
      { revoked: true, revoked_at: new Date() },
    );
    await this.activityLogRepository.save({
      user_id: userId,
      action: 'LOGOUT',
      entity_type: 'users',
      entity_id: userId,
    });
    return { message: 'Berhasil keluar dari sistem.' };
  }
}

