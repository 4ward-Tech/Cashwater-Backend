import { UserRole } from '../../users/entities/user.entity';
export declare class CreateUserDto {
    email: string;
    password: string;
    role?: UserRole;
}
