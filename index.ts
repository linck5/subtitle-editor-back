import * as dotenv from 'dotenv';
dotenv.config({path: '.env.development'});
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import { ApplicationModule } from './src/app.module';
import * as cors from 'cors';
import * as expressJWT from 'express-jwt';
import { DTOValidationPipe } from './src/common/dtoValidation.pipe';
import { NumberParserPipe } from './src/common/parsers/numberParser.pipe';
import { BooleanParserPipe } from './src/common/parsers/booleanParser.pipe';




const expressApp: express.Application = express();
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use('/profiles', express.static(path.join(__dirname, 'data/profiles')));


async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule, expressApp, {});
    app.setGlobalPrefix('api');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(expressJWT({ secret: process.env.JWT_SWECRET }).unless({ path: '/api/auth/authenticate' }), (error, req, res, next) => {
        if (error.name === 'UnauthorizedError') {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.message
            });
        }
    });

    app.useGlobalPipes(
      new NumberParserPipe(),
      new BooleanParserPipe(),
      new DTOValidationPipe()
    );
    await app.listen(process.env.PORT, () => {
        console.log('MSS is listening on port ' + process.env.PORT);
    });


}
bootstrap();
