'use client';

import { useSearchParams } from 'next/navigation';

//  /auth/ErrorLoginCatto.tsx

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="p-4">
      <h1>Authentication Error</h1>
      <p>Error message: {error}</p>
    </div>
  );
}
