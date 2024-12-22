import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    discription: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;

    @IsOptional()
    @IsNumber()
    user_id: number;
}
