import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: true, unique: [true, 'Email is required'] },
  emailValidated: { type: Boolean, default: false },
  password: { type: String, required: [true, 'Password is required'] },
  img: { type: String, default: '' },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model('User', userSchema);
