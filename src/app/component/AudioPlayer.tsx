'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAudio } from './context/audioContext';

const AudioPlayer = () => {
	const {
		trackSrc: contextTrackSrc,
		trackTitle: contextTrackTitle,
		play: triggerPlay
	} = useAudio();

	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [trackTitle, setTrackTitle] = useState('Aucun morceau sélectionné');
	const [trackSrc, setTrackSrc] = useState('');
	const [trackIndex, setTrackIndex] = useState(0);
	const [trackList, setTrackList] = useState<string[]>([]);
	const pathname = usePathname();

	useEffect(() => {
		if (contextTrackSrc) {
			setTrackSrc(contextTrackSrc);
		}
	}, [contextTrackSrc]);

	useEffect(() => {
		if (contextTrackTitle) {
			setTrackTitle(contextTrackTitle);
		}
	}, [contextTrackTitle]);

	useEffect(() => {
		if (!trackSrc) {
			return;
		}
		const newAudio = new Audio(trackSrc);
		setAudio(newAudio);
		setIsPlaying(true);
		setCurrentTime(0);
		setDuration(0);

		const handleLoadedMetadata = () => {
			setDuration(newAudio.duration);
		};
		const handleTimeUpdate = () => {
			setCurrentTime(newAudio.currentTime);
		};
		const handleEnded = () => {
			setIsPlaying(false);
		};

		newAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
		newAudio.addEventListener('timeupdate', handleTimeUpdate);
		newAudio.addEventListener('ended', handleEnded);

		return () => {
			newAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			newAudio.removeEventListener('timeupdate', handleTimeUpdate);
			newAudio.removeEventListener('ended', handleEnded);
			newAudio.pause();
		};
	}, [trackSrc]);

	useEffect(() => {
		if (audio) {
			if (isPlaying) {
				audio.play().catch((e) => console.error('Error playing audio:', e));
			} else {
				audio.pause();
			}
		}
	}, [isPlaying, audio]);

	useEffect(() => {
		if (audio) {
			audio.volume = isMuted ? 0 : volume;
		}
	}, [volume, isMuted, audio]);

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(parseFloat(e.target.value));
		setIsMuted(false);
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	const playPreviousTrack = () => {
		if (trackIndex > 0) {
			setTrackIndex(trackIndex - 1);
			setTrackSrc(trackList[trackIndex - 1]);
			setIsPlaying(true);
		}
	};

	const playNextTrack = () => {
		if (trackIndex < trackList.length - 1) {
			setTrackIndex(trackIndex + 1);
			setTrackSrc(trackList[trackIndex + 1]);
			setIsPlaying(true);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<footer className="fixed bottom-0 left-0 w-full bg-[#1f3a93] text-white p-3 flex flex-row items-center justify-between shadow-md">
			<div className="flex items-center space-x-2">
				<Music size={24} />
				<span className="text-sm font-medium">{trackTitle}</span>
			</div>
			<div className="flex flex-col items-center flex-grow mx-4">
				<div className="w-full flex items-center space-x-2 mb-2">
					<span className="text-xs">{formatTime(currentTime)}</span>
					<div className="flex-grow bg-white h-1 rounded relative overflow-hidden">
						<div className="bg-[#ff6100] h-full absolute left-0 top-0" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
					</div>
					<span className="text-xs">{formatTime(duration)}</span>
				</div>
				<div className="flex items-center space-x-4">
					<button onClick={playPreviousTrack} className="hover:text-[#ff6100]">
						<SkipBack size={24} />
					</button>
					<button onClick={togglePlayPause} className="hover:text-[#ff6100]">
						{isPlaying ? <Pause size={24} /> : <Play size={24} />}
					</button>
					<button onClick={playNextTrack} className="hover:text-[#ff6100]">
						<SkipForward size={24} />
					</button>
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
					style={{ background: `linear-gradient(to right, #5A5A5A 0%, #5A5A5A ${volume * 100}%, white ${volume * 100}%, white 100%)` }}
					onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #ff6100 0%, #ff6100 100%)')}
					onMouseOut={(e) => (e.currentTarget.style.background = `linear-gradient(to right, ${volume === 0 ? '#5A5A5A' : 'white'} 0%, white ${volume * 100}%)`)} />
			</div>
		</footer>
	);
};

export default AudioPlayer;
