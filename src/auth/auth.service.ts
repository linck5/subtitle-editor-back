import { sign } from 'jsonwebtoken';
import { Component, Inject } from '@nestjs/common';
import { promise } from 'selenium-webdriver';
import { User } from '../user/user.schema';


@Component()
// tslint:disable-next-line:component-class-suffix
export class AuthService {
    constructor() { }



    public createToken(user: User): any {
      const expiresIn = '48h'
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
