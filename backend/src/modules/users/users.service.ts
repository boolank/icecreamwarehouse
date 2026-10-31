import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
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

  async createUser(data: {
    user_code: string;
    full_name: string;
    username: string;
    password: string;
    email?: string;
    phone?: string;
    role_ids?: number[];
  }, createdBy?: number) {
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

    return this.findOne(savedUser.id);
  }
}

