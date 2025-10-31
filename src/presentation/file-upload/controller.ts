import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom.error';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const validTypes = ['users', 'products', 'categories'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type ${type} parameter, valid ones ${validTypes}`,
      });
    }

    const file = req.body.files[0] as UploadedFile;

    this.fileUploadService
      .uploadSingleFile(file, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type;
    const validTypes = ['users', 'products', 'categories'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type ${type} parameter, valid ones ${validTypes}`,
      });
    }

    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultipleFiles(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
