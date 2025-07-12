'use client';

import { createContext, useContext, useState } from 'react';

interface AudioContextType {
  trackSrc: string;
  trackTitle: string;
  trackAuthor: string;
  trackCover: string;
  setTrackSrc: (src: string) => void;
  setTrackTitle: (title: string) => void;
  setTrackAuthor: (author: string) => void;
  setTrackCover: (cover: string) => void;
  play: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackSrc, setTrackSrc] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [trackAuthor, setTrackAuthor] = useState('');
  const [trackCover, setTrackCover] = useState('');

  const play = () => {
    // utile pour déclencher un flag ou effet dans AudioPlayer
  };

  return (
    <AudioContext.Provider
      value={{
        trackSrc,
        trackTitle,
        trackAuthor,
        trackCover,
        setTrackSrc,
        setTrackTitle,
        setTrackAuthor,
        setTrackCover,
        play,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
