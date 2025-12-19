import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

// Video Section - Olive Branch Justice Theme
// Features: Video players, descriptions, fullscreen support

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
}

interface VideoSectionProps {
  videos: Video[];
}

interface VideoPlayerProps {
  video: Video;
  featured?: boolean;
}

function VideoPlayer({ video, featured = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const videoEl = e.currentTarget;
    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (videoId: string) => {
    const videoEl = document.getElementById(videoId) as HTMLVideoElement;
    if (videoEl) {
      videoEl.muted = !videoEl.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (videoId: string) => {
    const videoEl = document.getElementById(videoId) as HTMLVideoElement;
    if (videoEl) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoEl.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl overflow-hidden shadow-xl border border-[#c4a35a]/20 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Video Container */}
      <div className="relative group">
        <video
          id={`video-${video.id}`}
          className="w-full aspect-video bg-black cursor-pointer"
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={video.thumbnailUrl || '/images/logo.png'}
          preload="metadata"
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer"
              onClick={() => {
                const videoEl = document.getElementById(`video-${video.id}`) as HTMLVideoElement;
                videoEl?.play();
              }}
            >
              <Play className="w-8 h-8 text-[#5d6d4e] ml-1" />
            </motion.div>
          </div>
        )}
        
        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const videoEl = document.getElementById(`video-${video.id}`) as HTMLVideoElement;
                  if (videoEl?.paused) {
                    videoEl.play();
                  } else {
                    videoEl?.pause();
                  }
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => toggleMute(`video-${video.id}`)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={() => toggleFullscreen(`video-${video.id}`)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {video.duration}
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-[#3d3d3d] mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {video.title}
        </h3>
        <p className="text-[#3d3d3d]/70">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function VideoSection({ videos }: VideoSectionProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Video Documentation
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#c4a35a] to-transparent mx-auto mb-6" />
          <p className="text-[#3d3d3d]/70 max-w-2xl mx-auto">
            Visual presentations explaining the case details and timeline of events.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video, index) => (
            <VideoPlayer 
              key={video.id} 
              video={video} 
              featured={index === 1}
            />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#5d6d4e]/10 text-[#5d6d4e] px-6 py-3 rounded-full text-sm">
            <Play className="w-4 h-4" />
            Click on any video to play. Use fullscreen for best viewing experience.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
