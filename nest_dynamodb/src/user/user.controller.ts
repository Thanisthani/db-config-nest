import {
    Controller,
    Post,
    Body
} from '@nestjs/common';
import { logindto } from 'src/user/dto/login.dto';
import { userCreatedto } from './dto/userCreate.dto';
import { UserService } from './user.service';

@Controller('user')
    
export class UserController {

    constructor(
        private userService: UserService
    ) { }

      // Register user
      @Post("/register")
      createUser(@Body() userCreateDTO: userCreatedto) {
          return this.userService.register(userCreateDTO);
      }
    
    // login user
      @Post("/login")
      async login(@Body() loginDTO: logindto)
      {
          return this.userService.validateUser(loginDTO);
      }
    
}
