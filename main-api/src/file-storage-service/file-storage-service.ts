import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { AppConfigService } from 'src/app-config';
import { FilenameUtil } from 'src/utils';
import { FileStorage } from './file-storage.enums';
const { readFile, writeFile, unlink, stat } = fs.promises;

@Injectable()
export class FileStorageService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly filenameUtil: FilenameUtil,
  ) {
    if (
      !Object.values(FileStorage).some(
        (fsp) => fsp === this.appConfigService.fileStorage,
      )
    )
      throw new Error(
        'File Storage Protocol is not defined in environment variable or invalid.',
      );
  }

  async createFile(
    pathWithFilename: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    if (this.appConfigService.fileStorage === FileStorage.LOCAL) {
      const sourceFile = this.filenameUtil.buildFullPath(
        this.appConfigService.filePath,
        pathWithFilename,
      );
      await writeFile(sourceFile, fileBuffer);
    } else throw new Error('Storage not found.');
  }

  async checkIfFileExist(pathWithFilename: string): Promise<boolean> {
    if (this.appConfigService.fileStorage === FileStorage.LOCAL) {
      const sourceFile = this.filenameUtil.buildFullPath(
        this.appConfigService.filePath,
        pathWithFilename,
      );
      {
        try {
          await stat(sourceFile);
          return true;
        } catch (err) {
          if (err?.code === 'ENOENT') {
            return false;
          }
        }
      }
    } else throw new Error('Storage not found.');
  }

  async getFile(pathWithFilename: string): Promise<Buffer> {
    if (this.appConfigService.fileStorage === FileStorage.LOCAL) {
      const sourceFile = this.filenameUtil.buildFullPath(
        this.appConfigService.filePath,
        pathWithFilename,
      );
      let buffer: Buffer;
      try {
        buffer = await readFile(sourceFile);
      } catch (err) {
        if (err?.code === 'ENOENT') {
          throw new NotFoundException('Document file does not exist.');
        } else {
          throw err;
        }
      }
      return buffer;
    } else throw new Error('Storage not found.');
  }

  async deleteFile(pathWithFilename: string): Promise<void> {
    if (this.appConfigService.fileStorage === FileStorage.LOCAL) {
      const sourceFile = this.filenameUtil.buildFullPath(
        this.appConfigService.filePath,
        pathWithFilename,
      );
      try {
        await unlink(sourceFile);
      } catch (err) {
        if (err?.code === 'ENOENT') {
          throw new NotFoundException('Document file does not exist.');
        } else {
          throw err;
        }
      }
    } else throw new Error('Storage not found.');
  }
}
