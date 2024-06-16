"use client";

import NextLink, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

interface CoolLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  target?: string;
}

const CoolLink: React.FC<CoolLinkProps> = ({ children, ...props }) => {
  return (
    <NextLink
      {...props}
      className='text-foreground hover:border-b border-b-muted-foreground'
    >
      {children}
    </NextLink>
  );
};

export default CoolLink;
