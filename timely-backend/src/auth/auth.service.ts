import { Injectable,UnauthorizedException } from '@nestjs/common';
import { clearSupabaseSession, supabase } from 'src/config/supabase.cliente';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    async register(userDto:AuthDto){
        
        const {data,error}=await supabase.auth.signUp({
            email:userDto.email,
            password:userDto.password,
            options: {
                data: {
                    role: userDto.role || 'cliente', // Esto va a user_metadata y aparece en el JWT
                    name: userDto.name,
                    phone: userDto.phone
                }
            }
        })
        if(error){
            throw new UnauthorizedException(error.message);
        }
        
        //gaurdar el nombre de usuario y telefono y estatus en la tabla x
        const userId=data.user?.id;
        if(userId){
            const {error:insertError}=await supabase
                    .from('user_status')
                    .insert({
                        id:userId,
                        user_name:userDto.name,
                        phone:userDto.phone,
                        role:userDto.role,
                    });
        if(insertError){
            throw new Error(insertError.message);
        }
            
        }

        return data;
    }

    async login(email:string,password:string){
        
        const{data,error}=await supabase.auth.signInWithPassword({email,password});
        if(error){
            throw new UnauthorizedException(error.message);
        }
        return data;
    }
}
