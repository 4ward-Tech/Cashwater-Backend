import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(email: string, password: string, role?: UserRole): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOne(id: string): Promise<User | null>;
}
