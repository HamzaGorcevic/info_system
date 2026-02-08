import { CreateUserDto, UpdateUserDto } from '../dto/user.dto.js';
import { User } from '../entities/user.entity.js';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: CreateUserDto): Promise<User>;
    update(id: string, user: UpdateUserDto): Promise<User>;
    verifyUser(id: string, adminId: string): Promise<void>;
    delete(id: string): Promise<void>;
}
