import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.schema';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class AuthService {
    constructor() { }



    public createToken(user: User): any {
      const expiresIn = process.env.JWT_EXPIRES_IN;
      const secretOrKey = process.env.JWT_SWECRET;
      const Payload = { username: user.username, roles: user.roles };
      const token = sign(Payload, secretOrKey, { expiresIn });
      return {
        message: 'Success',
        token: token,
        expiresIn: expiresIn
      };
    }


    async validateUser(user): Promise<boolean> {
      // put some validation logic here
      // for example query user by id / email / username
      return true;
    }
}
