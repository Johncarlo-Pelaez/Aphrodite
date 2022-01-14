import { Injectable } from '@nestjs/common';
import * as filenamify from 'filenamify';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class FilenameUtil {
  sanitize(text: string): string {
    let sanitized = filenamify(text, { replacement: ' ' });
    sanitized = sanitized.replace(/ /g, ' ');
    sanitized = sanitized.trim();
    return sanitized;
  }

  generateName(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  getFilenameWithoutExtension(filePath: string): string {
    return path.parse(filePath).name;
  }

  buildFullPath(filePath: string, fileName: string): string {
    return path.join(filePath, fileName);
  }

  removeNotAllowedChar(filaname: string): string {
    return filaname?.replace(/\\|\*|\/|\?|"|:|<|>|\|/g, '');
  }
}
