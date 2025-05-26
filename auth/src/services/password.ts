import {scryptSync, randomBytes } from 'node:crypto';
export class Password{
    static toHash(password: string):string{
        const salt = randomBytes(8).toString('hex');
        const buf =  scryptSync(password, salt, 64) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    };

    static compare(storedPassword: string, suppliedPassword: string): boolean{
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = scryptSync(suppliedPassword, salt, 64) as Buffer;
        return buf.toString('hex') === hashedPassword
    };

}