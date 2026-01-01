import { User, CreateUserInput, UpdateUserInput } from '../entities/user.entity.js';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: CreateUserInput): Promise<User>;
    update(id: string, user: UpdateUserInput): Promise<User>;
}
