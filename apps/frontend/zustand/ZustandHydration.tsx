'use client';

import * as React from 'react';
import { useBearStore } from './zustandStore';

// "@/zustand/store";

const ZustandHydration = () => {
  React.useEffect(() => {
    useBearStore.persist.rehydrate();
  }, []);

  return null;
};

export default ZustandHydration;
