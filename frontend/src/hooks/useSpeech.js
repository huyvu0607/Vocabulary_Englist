import { useEffect, useState } from 'react';

export function useSpeech() {
  const [supported, setSupported] = useState(
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  );
  const [speakingText, setSpeakingText] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const loadVoices = () => {
    setVoices(window.speechSynthesis.getVoices());
  };

  const speak = (text) => {
    if (!supported || !text) return Promise.resolve();

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    // Ưu tiên giọng en-US
    const usVoice = voices.find(v => v.lang.startsWith('en-US'));
    if (usVoice) utterance.voice = usVoice;
    setSpeakingText(text);

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        setSpeakingText('');
        resolve();
      };
      utterance.onerror = (event) => {
        setSpeakingText('');
        reject(event.error);
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  return { supported, speak, speakingText };
}