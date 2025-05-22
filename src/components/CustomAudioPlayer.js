import React, { useState, useRef, useEffect } from 'react';
import { Box, Slider, IconButton, Typography } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

const CustomAudioPlayer = ({ src, duration, theme, isOwnMessage }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [totalDuration, setTotalDuration] = useState(duration || '0:00');
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
    const [error, setError] = useState(null);

    const formatTime = (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getThemeColors = () => {
        if (theme === 'dark') {
            return {
                primary: '#6c63ff',
                background: 'rgba(45, 45, 68, 0.95)',
                text: '#ffffff'
            };
        } else if (theme === 'cute') {
            return {
                primary: '#ff4d6d',
                background: 'rgba(255, 240, 245, 0.95)',
                text: '#ff4d6d'
            };
        }
        return {
            primary: '#ff69b4',
            background: 'rgba(255, 255, 255, 0.95)',
            text: '#ff69b4'
        };
    };

    const colors = getThemeColors();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            try {
                if (audio.duration && isFinite(audio.duration)) {
                    setTotalDuration(formatTime(audio.duration));
                    setIsMetadataLoaded(true);
                    setError(null);
                } else {
                    // If we have a duration prop, use it
                    if (duration) {
                        setTotalDuration(duration);
                        setIsMetadataLoaded(true);
                        setError(null);
                    } else {
                        setError('Could not load audio duration');
                    }
                }
            } catch (err) {
                console.error('Error loading audio metadata:', err);
                setError('Error loading audio');
            }
        };

        const handleError = (e) => {
            console.error('Audio error:', e);
            setError('Error playing audio');
            setIsMetadataLoaded(false);
        };

        const updateProgress = () => {
            try {
                if (audio.duration && isFinite(audio.duration)) {
                    setProgress((audio.currentTime / audio.duration) * 100);
                    setCurrentTime(formatTime(audio.currentTime));
                }
            } catch (err) {
                console.error('Error updating progress:', err);
            }
        };

        // Set up event listeners
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => setIsPlaying(false));
        audio.addEventListener('error', handleError);

        // Try to load metadata immediately
        if (audio.readyState >= 1) {
            handleLoadedMetadata();
        }

        // If we have a duration prop, use it immediately
        if (duration) {
            setTotalDuration(duration);
            setIsMetadataLoaded(true);
        }

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', () => setIsPlaying(false));
            audio.removeEventListener('error', handleError);
        };
    }, [duration]);

    const togglePlay = () => {
        if (!isMetadataLoaded && !duration) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Error playing audio:', err);
                    setError('Error playing audio');
                });
            }
            setIsPlaying(!isPlaying);
        } catch (err) {
            console.error('Error toggling play:', err);
            setError('Error playing audio');
        }
    };

    const handleProgressChange = (e, newValue) => {
        if (!isMetadataLoaded && !duration) return;

        try {
            const audio = audioRef.current;
            if (audio.duration && isFinite(audio.duration)) {
                audio.currentTime = (newValue / 100) * audio.duration;
                setProgress(newValue);
            }
        } catch (err) {
            console.error('Error changing progress:', err);
            setError('Error changing audio position');
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: colors.background,
            borderRadius: '20px',
            p: 1,
            width: '100%',
            maxWidth: '300px',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
            {/* Hidden audio element */}
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Play/Pause Button */}
            <IconButton
                onClick={togglePlay}
                disabled={!isMetadataLoaded && !duration}
                sx={{
                    color: colors.primary,
                    opacity: (isMetadataLoaded || duration) ? 1 : 0.5,
                    '&:hover': {
                        transform: (isMetadataLoaded || duration) ? 'scale(1.1)' : 'none'
                    },
                    transition: 'transform 0.2s ease'
                }}
            >
                {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            {/* Progress Bar */}
            <Box sx={{ flex: 1, mx: 1 }}>
                <Slider
                    value={progress}
                    onChange={handleProgressChange}
                    disabled={!isMetadataLoaded && !duration}
                    size="small"
                    sx={{
                        color: colors.primary,
                        opacity: (isMetadataLoaded || duration) ? 1 : 0.5,
                        '& .MuiSlider-thumb': {
                            width: 12,
                            height: 12
                        },
                        '& .MuiSlider-track': {
                            height: 4
                        },
                        '& .MuiSlider-rail': {
                            height: 4,
                            opacity: 0.3
                        }
                    }}
                />
                <Typography
                    variant="caption"
                    sx={{
                        color: error ? '#ff4444' : colors.text,
                        display: 'block',
                        textAlign: 'center',
                        fontWeight: 500,
                        opacity: (isMetadataLoaded || duration) ? 1 : 0.5
                    }}
                >
                    {error ? error : (isMetadataLoaded || duration) ? currentTime : 'Loading...'}
                </Typography>
            </Box>
        </Box>
    );
};

export default CustomAudioPlayer; 