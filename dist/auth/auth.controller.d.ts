import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    login(loginDto: LoginDto, req: any): Promise<{
        access_token: string;
    }>;
}
