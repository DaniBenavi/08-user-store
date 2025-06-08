import { bcryptAdapter } from '../../config/bycript.adapter';
import { envs } from '../../config/envs';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data/mongo/models/user.model';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      // encript password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // jwt token for authentication users

      // email verification

      this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });
      if (!token) throw CustomError.internalServer('Error generating token');

      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

    return;
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest('Email not found');

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest('Password is not valid');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
      email: user.email,
    });
    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      user: userEntity,
      token: token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
