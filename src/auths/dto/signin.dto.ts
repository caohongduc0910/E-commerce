import { IsDefined, IsEmail, IsString } from "class-validator"

export class SignInDTO {
    @IsDefined()
    @IsString()
    @IsEmail()
    readonly email: string
    
    @IsDefined()
    @IsString()
    readonly password: string
}