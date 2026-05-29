import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster: string;
  className?: string;
  /** Load as soon as possible (hero). Default: when near viewport. */
  priority?: boolean;
  playbackRate?: number;
  wrapperClassName?: string;
}

export default function LazyVideo({
  src,
  poster,
  className = '',
  priority = false,
  playbackRate,
  wrapperClassName = '',
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(priority);

  useEffect(() => {
    if (priority || active) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!active || !video) return;

    if (!video.src) {
      video.src = src;
      video.load();
    }

    const play = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });

    return () => {
      video.pause();
    };
  }, [active, src]);

  return (
    <div ref={containerRef} className={wrapperClassName}>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload={priority ? 'metadata' : 'none'}
        aria-hidden="true"
        onLoadedMetadata={(e) => {
          if (playbackRate) e.currentTarget.playbackRate = playbackRate;
        }}
        onPlaying={(e) => e.currentTarget.removeAttribute('poster')}
      />
    </div>
  );
}
