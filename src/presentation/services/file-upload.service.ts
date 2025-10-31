import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { UUID } from '../../config/uuid.adapter';
import { CustomError } from '../../domain/errors/custom.error';

export class FileUploadService {
  constructor(private readonly uuid = UUID.v4) {}

  private chechFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingleFile(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Invalid file extension ${fileExtension}, valid extensions are ${validExtensions}`
        );
      }
      const destination = path.resolve(__dirname, '../../../', folder);
      this.chechFolder(destination);

      const filename = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destination}/${filename}`);

      return { filename };
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleFiles(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
  ) {
    const filesNames = await Promise.all(
      files.map((file) => this.uploadSingleFile(file, folder, validExtensions))
    );
    return filesNames;
  }
}
