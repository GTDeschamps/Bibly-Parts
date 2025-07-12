'use client';

import { useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX,
  SkipBack, SkipForward
} from 'lucide-react';
import { useAudio } from './context/audioContext';

const AudioPlayer = () => {
  const {
    trackSrc,
    trackTitle,
    trackAuthor,
    trackCover,
  } = useAudio();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!trackSrc || typeof trackSrc !== 'string' || !trackSrc.startsWith('https')) {
      console.warn('URL audio invalide :', trackSrc);
      return;
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(trackSrc);
    setAudio(newAudio);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);

    const handleLoadedMetadata = () => setDuration(newAudio.duration);
    const handleTimeUpdate = () => setCurrentTime(newAudio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    newAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    newAudio.addEventListener('timeupdate', handleTimeUpdate);
    newAudio.addEventListener('ended', handleEnded);

    newAudio.play().catch(e => console.error('Erreur lecture audio:', e));

    return () => {
      newAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      newAudio.removeEventListener('timeupdate', handleTimeUpdate);
      newAudio.removeEventListener('ended', handleEnded);
      newAudio.pause();
    };
  }, [trackSrc]);

  useEffect(() => {
    if (audio) audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audio]);

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((e) => console.error('Erreur lecture audio:', e));
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const formatTime = (time: number) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#1f3a93] text-white p-3 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center space-x-3">
        {trackCover && (
          <img src={trackCover} alt="cover" className="w-10 h-10 rounded object-cover" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{trackTitle || 'Aucun morceau sélectionné'}</span>
          <span className="text-xs text-gray-300">{trackAuthor || ''}</span>
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow mx-4">
        <div className="w-full flex items-center space-x-2 mb-2">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <div className="flex-grow bg-white h-1 rounded relative overflow-hidden">
            <div
              className="bg-[#ff6100] h-full absolute left-0 top-0"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hover:text-[#ff6100]"><SkipBack size={24} /></button>
          <button onClick={togglePlayPause} className="hover:text-[#ff6100]">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="hover:text-[#ff6100]"><SkipForward size={24} /></button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={toggleMute} className="hover:text-[#ff6100]">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 rounded cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default AudioPlayer;
