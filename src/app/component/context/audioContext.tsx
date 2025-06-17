'use client';

import React, { createContext, useContext, useState } from 'react';

type AudioContextType = {
  trackSrc: string;
  setTrackSrc: (src: string) => void;
  trackTitle: string;
  setTrackTitle: (title: string) => void;
  play: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackSrc, setTrackSrc] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [shouldPlay, setShouldPlay] = useState(false);

  const play = () => {
    setShouldPlay(true); // utilisé par le player pour déclencher la lecture
    setTimeout(() => setShouldPlay(false), 100); // reset pour ne pas relancer en boucle
  };

  return (
    <AudioContext.Provider value={{ trackSrc, setTrackSrc, trackTitle, setTrackTitle, play }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
