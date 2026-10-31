import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { DataChangeLog } from './entities/data-change-log.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(DataChangeLog)
    private dataChangeLogRepository: Repository<DataChangeLog>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      where: { is_deleted: false },
      relations: ['user_roles', 'user_roles.role'],
      order: { id: 'ASC' },
    });
  }

  async findAllRoles() {
    return this.roleRepository.find({
      where: { is_active: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['user_roles', 'user_roles.role'],
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: `Pengguna ID ${id} tidak ditemukan.` },
      });
    }
    return user;
  }

  async createUser(
    data: {
      user_code: string;
      full_name: string;
      username: string;
      password: string;
      email?: string;
      phone?: string;
      role_ids?: number[];
    },
    createdBy?: number,
  ) {
    const existingUsername = await this.userRepository.findOne({
      where: { username: data.username, is_deleted: false },
    });
    if (existingUsername) {
      throw new ConflictException({
        success: false,
        error: { code: 'USERNAME_EXISTS', message: `Username '${data.username}' sudah digunakan.` },
      });
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      user_code: data.user_code,
      full_name: data.full_name,
      username: data.username,
      password_hash,
      email: data.email || null,
      phone: data.phone || null,
      created_by: createdBy || null,
    });

    const savedUser = await this.userRepository.save(user);

    if (data.role_ids && data.role_ids.length > 0) {
      const userRoles = data.role_ids.map((roleId) =>
        this.userRoleRepository.create({
          user_id: savedUser.id,
          role_id: roleId,
          assigned_by: createdBy || null,
        }),
      );
      await this.userRoleRepository.save(userRoles);
    }

    // Log to data_change_logs
    const log = this.dataChangeLogRepository.create({
      table_name: 'users',
      record_id: savedUser.id,
      operation: 'INSERT',
      old_data: null,
      new_data: {
        id: savedUser.id,
        user_code: savedUser.user_code,
        full_name: savedUser.full_name,
        username: savedUser.username,
        email: savedUser.email,
        phone: savedUser.phone,
      },
      changed_columns: ['user_code', 'full_name', 'username', 'email', 'phone'],
      changed_by: createdBy || null,
    });
    await this.dataChangeLogRepository.save(log);

    return this.findOne(savedUser.id);
  }

  async updateUser(
    id: number,
    data: {
      full_name?: string;
      email?: string;
      phone?: string;
      is_active?: boolean;
      role_ids?: number[];
    },
    updatedBy?: number,
  ) {
    const user = await this.findOne(id);
    const oldSnapshot = {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      is_active: user.is_active,
    };
    const changedCols: string[] = [];

    if (data.full_name !== undefined && data.full_name !== user.full_name) {
      changedCols.push('full_name');
      user.full_name = data.full_name;
    }
    if (data.email !== undefined && data.email !== user.email) {
      changedCols.push('email');
      user.email = data.email;
    }
    if (data.phone !== undefined && data.phone !== user.phone) {
      changedCols.push('phone');
      user.phone = data.phone;
    }
    if (data.is_active !== undefined && data.is_active !== user.is_active) {
      changedCols.push('is_active');
      user.is_active = data.is_active;
    }

    const savedUser = await this.userRepository.save(user);

    // Update roles if provided
    if (data.role_ids !== undefined) {
      await this.userRoleRepository.delete({ user_id: id });
      if (data.role_ids.length > 0) {
        const userRoles = data.role_ids.map((roleId) =>
          this.userRoleRepository.create({
            user_id: id,
            role_id: roleId,
            assigned_by: updatedBy || null,
          }),
        );
        await this.userRoleRepository.save(userRoles);
      }
      changedCols.push('roles');
    }

    if (changedCols.length > 0) {
      const log = this.dataChangeLogRepository.create({
        table_name: 'users',
        record_id: id,
        operation: 'UPDATE',
        old_data: oldSnapshot,
        new_data: {
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          is_active: user.is_active,
        },
        changed_columns: changedCols,
        changed_by: updatedBy || null,
      });
      await this.dataChangeLogRepository.save(log);
    }

    return this.findOne(id);
  }

  async toggleStatus(id: number, updatedBy?: number) {
    const user = await this.findOne(id);
    const oldStatus = user.is_active;
    user.is_active = !oldStatus;
    const saved = await this.userRepository.save(user);

    const log = this.dataChangeLogRepository.create({
      table_name: 'users',
      record_id: id,
      operation: 'UPDATE',
      old_data: { is_active: oldStatus },
      new_data: { is_active: saved.is_active },
      changed_columns: ['is_active'],
      changed_by: updatedBy || null,
    });
    await this.dataChangeLogRepository.save(log);

    return saved;
  }

  async resetPassword(id: number, newPassword: string, updatedBy?: number) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: `Pengguna ID ${id} tidak ditemukan.` },
      });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    const log = this.dataChangeLogRepository.create({
      table_name: 'users',
      record_id: id,
      operation: 'UPDATE',
      old_data: { action: 'password_reset_attempted' },
      new_data: { action: 'password_reset_successful' },
      changed_columns: ['password_hash'],
      changed_by: updatedBy || null,
    });
    await this.dataChangeLogRepository.save(log);

    return { success: true, message: 'Kata sandi pengguna berhasil diperbarui.' };
  }

  async getAuditLogs(id: number) {
    await this.findOne(id);
    return this.dataChangeLogRepository.find({
      where: {
        table_name: 'users',
        record_id: id,
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }
}
