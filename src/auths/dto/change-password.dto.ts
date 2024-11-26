import { IsDefined, IsEmail, IsString } from "class-validator"

export class ChangePasswordDTO {
    @IsDefined()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsDefined()
    @IsString()
    password: string

    @IsDefined()
    @IsString()
    newPassword: string
    
    @IsDefined()
    @IsString()
    readonly cfPassword: string
}