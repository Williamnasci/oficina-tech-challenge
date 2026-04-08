import { AuthController } from '../../../../src/modules/auth/auth.controller';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let jwtService: any;

    beforeEach(() => {
        jwtService = {
            sign: jest.fn().mockReturnValue('token-123'),
        };
        controller = new AuthController(jwtService);
    });

    it('should login with valid credentials', async () => {
        const result = await controller.login({ username: 'admin', password: 'admin' });
        expect(result.access_token).toBe('token-123');
    });

    it('should throw on invalid credentials', async () => {
        await expect(controller.login({ username: 'wrong', password: '123' })).rejects.toThrow(UnauthorizedException);
    });
});
