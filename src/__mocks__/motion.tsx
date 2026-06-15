import React from 'react';

export const motion = {
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
};

export const AnimatePresence = ({ children }: any) => <>{children}</>;
