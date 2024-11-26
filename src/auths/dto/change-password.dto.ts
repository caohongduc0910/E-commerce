import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class ChangePasswordDTO {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    newPassword: string
}