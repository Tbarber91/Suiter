'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseVoiceSearchOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
  continuous?: boolean;
}

export function useVoiceSearch({ onResult, lang, continuous = false }: UseVoiceSearchOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    const win = window as unknown as IWindowWithSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  });
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('SpeechRecognition stop error:', e);
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    setInterimTranscript('');
    isManuallyStoppedRef.current = false;

    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // If an instance is currently running, stop it first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = lang || (navigator.language ? navigator.language : 'en-AU');
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcriptPart = result[0]?.transcript || '';
          if (result.isFinal) {
            currentFinal += transcriptPart;
          } else {
            currentInterim += transcriptPart;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (currentFinal) {
          // Clean up transcript: remove trailing periods often added by speech recognizer
          const cleanedText = currentFinal.trim().replace(/\.+$/, '');
          setTranscript(cleanedText);
          setInterimTranscript('');
          if (onResult) {
            onResult(cleanedText);
          }
        } else if (currentInterim && onResult) {
          // Optional: real-time update with interim text
          onResult(currentInterim.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please tap the microphone and speak again.');
        } else if (event.error === 'audio-capture') {
          setErrorMessage('No microphone detected or microphone is busy.');
        } else if (event.error === 'network') {
          setErrorMessage('Network connection required for speech recognition.');
        } else if (event.error !== 'aborted') {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setErrorMessage(err?.message || 'Failed to start speech recognition.');
    }
  }, [continuous, lang, onResult]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore unmount abort errors
        }
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    clearError,
  };
}
