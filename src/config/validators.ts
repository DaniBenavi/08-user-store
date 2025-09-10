import mongoose, { mongo } from 'mongoose';

export class Validators {
  static isMongoId(id: string) {
    return mongoose.isValidObjectId(id);
  }
}
