import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export default function HlsVideo({
  src,
  className,
  style,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  ...props
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;

    const startPlayback = () => {
      video.removeAttribute('poster');
      if (autoPlay) {
        video.play().catch((e) => console.warn('HLS autoplay prevented:', e));
      }
    };

    if (Hls.isSupported()) {
      hls = new Hls({ startLevel: 2 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', startPlayback, { once: true });
    }

    video.addEventListener('playing', () => video.removeAttribute('poster'));

    return () => {
      hls?.destroy();
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      {...props}
    />
  );
}
