import { UserBadRequest } from './../common/exeptions/user-bad-request';
import { LoginUserDto } from './../models/users/login-user.dto';
import { AuthService } from './auth.service';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from '../core/services/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    signIn() {},
    validatePassword() {},
    validate() {},
  };

  const jwtService = {
    sign() {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SignIn', () => {
    it('should call usersServise signIn() once with correct username', async () => {
      // Arrange
      const testUserEntity = {
        id: 'userId',
        username: 'anemalP',
        password: 'An3ma!p',
        email: 'pla@pla.pla',
        firstName: 'Plamena',
        lastName: 'Vladimirova',
        joined: new Date(),
        recipes: Promise.resolve([]),
      };
      const fakeToken = 'token';

      const usersServiseSignInSpy = jest
        .spyOn(usersService, 'signIn')
        .mockImplementation(() => Promise.resolve(testUserEntity));
      const usersServiseValidatePasswordSpy = jest
        .spyOn(usersService, 'validatePassword')
        .mockImplementation(() => Promise.resolve(true));
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => Promise.resolve(fakeToken));

      const testUserData: LoginUserDto = {
        username : 'anemalP',
        password: 'An3ma!p',
      };

      // Act
      await service.signIn(testUserData);

      // Assert
      expect(usersServiseSignInSpy).toBeCalledTimes(1);
      expect(usersServiseSignInSpy).toBeCalledWith(testUserData.username);

      usersServiseSignInSpy.mockRestore();
      usersServiseValidatePasswordSpy.mockRestore();
      jwtServiceSignSpy.mockRestore();
    });

    it('should return 400 UserBadRequest with correct error message when usersServise signIn() is called with incorrect username', async () => {
      // Arrange
      const testUserEntity = {
        id: 'userId',
        username: 'anemalP',
        password: 'An3ma!p',
        email: 'pla@pla.pla',
        firstName: 'Plamena',
        lastName: 'Vladimirova',
        joined: new Date(),
        recipes: Promise.resolve([]),
      };
      const fakeToken = 'token';

      const usersServiseSignInSpy = jest
        .spyOn(usersService, 'signIn')
        .mockImplementation(() => Promise.resolve(undefined));
      const usersServiseValidatePasswordSpy = jest
        .spyOn(usersService, 'validatePassword')
        .mockImplementation(() => Promise.resolve(true));
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => Promise.resolve(fakeToken));

      const testUserData: LoginUserDto = {
        username : 'incorrect',
        password: 'An3ma!p',
      };
      let error;

      // Act & Assert
      try {
        await service.signIn(testUserData);
      } catch (e) { error = e; }

      await expect(error).toBeInstanceOf(UserBadRequest);
      usersServiseSignInSpy.mockRestore();
      usersServiseValidatePasswordSpy.mockRestore();
      jwtServiceSignSpy.mockRestore();
    });
  });
});
