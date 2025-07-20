'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Define types for browser APIs to avoid using `any`
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // This ref tracks the user's *intent* to listen, which is more reliable
  // for the onend handler than the `isListening` state.
  const listeningIntentRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newInterim = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newFinal += event.results[i][0].transcript;
        } else {
          newInterim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(newInterim);
      if (newFinal) {
        setFinalTranscript((prev) => prev + newFinal);
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      // If permission is denied, stop trying to listen.
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed'
      ) {
        listeningIntentRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // The `onend` event can fire for various reasons.
      // We only want to restart if we are still intentionally listening.
      if (listeningIntentRef.current) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    // Cleanup function to stop recognition when the component unmounts.
    return () => {
      listeningIntentRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setInterimTranscript('');
      setFinalTranscript('');
      listeningIntentRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      listeningIntentRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const transcript = finalTranscript + interimTranscript;

  return {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
  };
}; 

