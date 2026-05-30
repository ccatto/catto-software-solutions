// app/components/AtomicDesign/atoms/Auth/LinkSignInCatto.tsx
import { LinkCatto } from '@ccatto/ui';
import { UserRound } from 'lucide-react';

const LinkSignInCatto = () => {
  return (
    <LinkCatto
      href="/signin"
      variant="outline"
      className="flex items-center"
      rel="noopener noreferrer"
      aria-label="SignIn page"
    >
      <UserRound className="mr-4 h-4 w-4" />
      Sign In
    </LinkCatto>
  );
};

export default LinkSignInCatto;
