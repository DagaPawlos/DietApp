import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async hashLoginPassword(password: string, salt: string) {
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }
}
