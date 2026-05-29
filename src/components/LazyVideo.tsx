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
  const [videoReady, setVideoReady] = useState(false);

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
      setVideoReady(false);
    };
  }, [active, src]);

  return (
    <div ref={containerRef} className={`relative ${wrapperClassName}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out pointer-events-none ${
          videoReady ? 'opacity-0' : 'opacity-100'
        }`}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      <video
        ref={videoRef}
        className={`${className} transition-opacity duration-700 ease-out ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        loop
        playsInline
        autoPlay
        preload={priority ? 'metadata' : 'none'}
        aria-hidden="true"
        onLoadedMetadata={(e) => {
          if (playbackRate) e.currentTarget.playbackRate = playbackRate;
        }}
        onPlaying={() => setVideoReady(true)}
      />
    </div>
  );
}
