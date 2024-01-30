import {
  AuthenticationData,
  GetVerificationData,
  PostAuthenticationData,
  PostSignUpResData,
  SignUpData,
  VerificationData,
} from './type';
import { instance } from '..';

export const SIGN_UP_API = {
  signUp: (data: SignUpData) =>
    instance.post<PostSignUpResData>('/api/auth/owners/signup', data),
  authentication: (data: AuthenticationData) =>
    instance.post<PostAuthenticationData>(
      '/api/auth/owners/request-email',
      data,
    ),
  verify: (data: VerificationData) =>
    instance.get<GetVerificationData>('/api/auth/owners/verify', {
      params: {
        email: data.email,
        'verification-code': data.verificationCode,
      },
    }),
};
