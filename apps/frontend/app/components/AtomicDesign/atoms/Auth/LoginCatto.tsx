'use client';

import { LoginCatto as LoginCattoUI } from '@ccatto/auth-ui';
import { signIn } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

const LoginCatto = () => {
  const router = useRouter();

  return (
    <LoginCattoUI
      onSubmit={async ({ email, password }) => {
        const result = await signIn.email({ email, password });
        if (result?.error) {
          throw new Error(result.error.message ?? 'Sign in failed');
        }
        router.push('/dashboard');
      }}
    />
  );
};

export default LoginCatto;
