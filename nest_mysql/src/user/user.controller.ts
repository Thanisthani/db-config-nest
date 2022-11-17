import { Controller, Post, Get, Body ,UseGuards} from '@nestjs/common';
import { logindto } from './dto/login.dto';
import { userCreatedto } from './dto/userCreate.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(private userService: UserService)
    { }

     // Register user

     @Post("/register")
     createUser(@Body() userCreatedto: userCreatedto)
     {
         return this.userService.register(userCreatedto);
     }
 
 // Login User
     
     @Post("/login")
     async login(@Body() loginDTO: logindto)
     {
         return this.userService.validateUser(loginDTO);
     }
     
 // Protect route
    @UseGuards(AuthGuard('jwt'))
    @Get("/get")
    async getUser()
    {
        return { name: "Jhon", email: "jhon@gmail.com" };
    }

}
