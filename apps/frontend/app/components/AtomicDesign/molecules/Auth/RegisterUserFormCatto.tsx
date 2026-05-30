'use client';

import { RegisterUserFormCatto as RegisterUserFormCattoUI } from '@ccatto/auth-ui';
import { signUp } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

const RegisterUserFormCatto = () => {
  const router = useRouter();

  return (
    <RegisterUserFormCattoUI
      onSubmit={async ({ name, email, password }) => {
        const result = await signUp.email({ name, email, password });
        if (result?.error) {
          throw new Error(result.error.message ?? 'Sign up failed');
        }
        router.push('/dashboard');
      }}
    />
  );
};

export default RegisterUserFormCatto;
