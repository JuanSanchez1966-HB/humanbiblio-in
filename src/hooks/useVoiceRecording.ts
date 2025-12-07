import { useState, useRef, useCallback } from 'react';

interface VoiceRecordingState {
  isRecording: boolean;
  isPlaying: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  error: string | null;
}

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isPlaying: false,
    audioBlob: null,
    audioUrl: null,
    duration: 0,
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false
        }));

        // Detener stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();

      // Actualizar duración cada segundo
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
        }));
      }, 1000);

      setState(prev => ({
        ...prev,
        isRecording: true,
        error: null,
        duration: 0
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'No se pudo acceder al micrófono'
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const playRecording = useCallback(() => {
    if (state.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(state.audioUrl);
        
        audioRef.current.onended = () => {
          setState(prev => ({ ...prev, isPlaying: false }));
        };
      }

      if (state.isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    }
  }, [state.audioUrl, state.isPlaying]);

  const clearRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    setState({
      isRecording: false,
      isPlaying: false,
      audioBlob: null,
      audioUrl: null,
      duration: 0,
      error: null
    });
  }, [state.audioUrl]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
    formatDuration
  };
}