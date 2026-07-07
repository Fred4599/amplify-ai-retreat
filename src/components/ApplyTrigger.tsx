import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ApplyTriggerProps = {
  children: ReactNode;
  className?: string;
  href?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href'>;

export default function ApplyTrigger({
  children,
  className,
  href = '/apply',
  ...rest
}: ApplyTriggerProps) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
