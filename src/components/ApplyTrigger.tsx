import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ApplyTriggerProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href'>;

export default function ApplyTrigger({ children, className, ...rest }: ApplyTriggerProps) {
  return (
    <a href="/apply" className={className} {...rest}>
      {children}
    </a>
  );
}
