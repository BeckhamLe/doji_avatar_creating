import type { ReactNode } from 'react';

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="phone-shell" style={{
      width: '100vw',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}
