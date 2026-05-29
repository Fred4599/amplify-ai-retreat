import type { TargetAndTransition, Transition } from 'motion/react';

type MotionProps = {
  initial?: false | TargetAndTransition;
  animate?: TargetAndTransition;
  whileInView?: TargetAndTransition;
  viewport?: { once?: boolean; margin?: string };
  transition?: Transition;
};

/** SSR-safe scroll reveal: static while hydrating, animate on scroll after mount. */
export function inView(
  hydrated: boolean,
  hidden: TargetAndTransition,
  visible: TargetAndTransition,
  transition?: Transition,
  margin = '-100px',
): MotionProps {
  if (!hydrated) {
    return { initial: false, animate: visible };
  }

  return {
    initial: hidden,
    whileInView: visible,
    viewport: { once: true, margin },
    transition,
  };
}

export function onMount(
  hydrated: boolean,
  hidden: TargetAndTransition,
  visible: TargetAndTransition,
  transition?: Transition,
): MotionProps {
  if (!hydrated) {
    return { initial: false, animate: visible };
  }

  return {
    initial: hidden,
    animate: visible,
    transition,
  };
}
