import { motion } from 'motion/react';
import { useHydrated } from './useHydrated';

type BlurTextTag = 'h1' | 'h2' | 'h3' | 'p' | 'div';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animateOnMount?: boolean;
  as?: BlurTextTag;
}

export default function BlurText({
  text,
  className,
  delay = 0.2,
  stagger = 0.05,
  animateOnMount = false,
  as: Tag = 'div',
}: BlurTextProps) {
  const hydrated = useHydrated();
  const words = text.split(' ');
  const MotionTag = motion[Tag] as typeof motion.div;

  if (!hydrated) {
    return (
      <Tag className={`flex flex-wrap max-w-full overflow-hidden ${className ?? ''}`}>
        {words.map((word, index) => (
          <span key={index} className="mr-[0.25em] inline-block last:mr-0">
            {word}
          </span>
        ))}
      </Tag>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <MotionTag
      className={`flex flex-wrap max-w-full overflow-hidden ${className ?? ''}`}
      variants={container}
      initial="hidden"
      animate={animateOnMount ? 'visible' : undefined}
      whileInView={animateOnMount ? undefined : 'visible'}
      viewport={animateOnMount ? undefined : { once: true, margin: '-100px' }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-[0.25em] inline-block last:mr-0">
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
