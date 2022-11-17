import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { userCreatedto } from './dto/userCreate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database/models/user.entity';
import { encodePassword } from 'src/utils/bcrypt';
import { logindto } from 'src/user/dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
    
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepositary: Repository<User>
    ) { }

    // register User

    async register(userCreateDTO: userCreatedto)
    {

        const existingUser = await this.getUserByEmail(userCreateDTO.email);

        if (!existingUser)
        {

            const password = await encodePassword(userCreateDTO.password);
            
            const newUser = this.userRepositary.save({ ...userCreateDTO, password });
            
            throw new HttpException({
                status: HttpStatus.CREATED,
                message: 'Sucessfully created'
            }, HttpStatus.CREATED);

            
        }
       
        throw new HttpException({
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'Already email registered'
        }, HttpStatus.NOT_ACCEPTABLE);
        
    }

    // Validate user

    async validateUser(loginDTO: logindto) {

        const user = await this.getUserByEmail(loginDTO.email);

        if (user) {

            const isMatch = await compare(loginDTO.password, user.password);

            if (isMatch) {
                
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    message: 'Sucessfully Logged In',
                    user: user
                }, HttpStatus.ACCEPTED);

            }

           throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Incorrect password',
                user: null
            }, HttpStatus.UNAUTHORIZED);
            
        }
        
        throw new HttpException({
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'User not exists',
            user: null
        }, HttpStatus.NOT_ACCEPTABLE);

    }

     // find user by email
    
     getUserByEmail(email: string)
     {
         return this.userRepositary.findOne({ where: { email } });
     }
}
