import { ReactNode } from 'react';

interface MobileCenterItCattoProps {
  children: ReactNode;
  /** Optional class names to be applied to the wrapper div */
  className?: string;
  /** Optional data-testid for testing */
  'data-testid'?: string;
}

const MobileCenterItCatto = ({
  children,
  className = '',
  'data-testid': dataTestId = 'mobile-center-it-catto',
}: MobileCenterItCattoProps) => {
  return (
    <div
      className={`flex justify-center md:block ${className}`}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

export default MobileCenterItCatto;
