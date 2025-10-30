import {  IsBoolean, IsDateString, IsOptional, IsString, Matches } from "class-validator";

export class ShedulesData{
    @IsDateString()
    date: string;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'time must be in format HH:MM or HH:MM:SS'
    })
    start_time: string;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'time must be in format HH:MM or HH:MM:SS'
    })
    end_time: string;

    @IsBoolean()
    available: boolean;
}



export class UpdateSchedules{
    @IsOptional()
    @IsString()
    date:string;

    @IsOptional()
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'time must be in format HH:MM or HH:MM:SS'
    })
    start_time: string;

    @IsOptional()
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'time must be in format HH:MM or HH:MM:SS'
    })
    end_time: string;

    @IsOptional()
    @IsBoolean()
    available: boolean;




}