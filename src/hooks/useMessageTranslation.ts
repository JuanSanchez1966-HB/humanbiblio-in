import { useState, useCallback } from 'react';

export type SupportedLanguage = 'en' | 'es';

interface TranslationCache {
  [key: string]: string;
}

export function useMessageTranslation() {
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const detectLanguage = useCallback((text: string): SupportedLanguage => {
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 'tener', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o', 'poder', 'decir', 'este', 'ir'];
    const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'];

    const words = text.toLowerCase().split(/\s+/);
    let spanishScore = 0;
    let englishScore = 0;

    words.forEach(word => {
      if (spanishWords.includes(word)) spanishScore++;
      if (englishWords.includes(word)) englishScore++;
    });

    const hasSpanishChars = /[áéíóúñ¿¡]/i.test(text);
    if (hasSpanishChars) spanishScore += 3;

    return spanishScore > englishScore ? 'es' : 'en';
  }, []);

  const translateText = useCallback(async (
    text: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage
  ): Promise<string> => {
    if (sourceLang === targetLang) {
      return text;
    }

    const cacheKey = `${sourceLang}-${targetLang}-${text}`;

    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    setIsTranslating(true);

    try {
      const response = await fetch('https://translate.googleapis.com/translate_a/single', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
        signal: AbortSignal.timeout(10000)
      }).catch(() => null);

      if (!response || !response.ok) {
        return translateTextFallback(text, sourceLang, targetLang);
      }

      const data = await response.json();
      const translated = data[0]?.[0]?.[0] || text;

      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translated
      }));

      return translated;
    } catch (error) {
      console.warn('Translation API failed, using fallback:', error);
      return translateTextFallback(text, sourceLang, targetLang);
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache]);

  const translateTextFallback = useCallback((
    text: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage
  ): string => {
    const translationPairs: Record<string, Record<string, string>> = {
      'es-en': {
        'hola': 'hello',
        'adiós': 'goodbye',
        'gracias': 'thank you',
        'por favor': 'please',
        'sí': 'yes',
        'no': 'no',
        'buenos días': 'good morning',
        'buenas tardes': 'good afternoon',
        'buenas noches': 'good evening',
        '¿cómo estás?': 'how are you?',
        'bien': 'good',
        'mal': 'bad',
        'te amo': 'i love you',
        'te quiero': 'i love you',
        'ayuda': 'help',
        'por favor ayúdame': 'please help me',
        '¿dónde estás?': 'where are you?',
        'estoy aquí': 'i am here',
        'hasta luego': 'see you later',
        'nos vemos': 'see you',
        'mucho gusto': 'nice to meet you',
        'encantado': 'pleased to meet you',
        'lo siento': 'i am sorry',
        'perdón': 'sorry',
        'disculpa': 'excuse me',
        'de nada': 'you are welcome',
        'con gusto': 'with pleasure',
        'claro': 'of course',
        'tal vez': 'maybe',
        'quizás': 'perhaps',
        'ahora': 'now',
        'después': 'later',
        'hoy': 'today',
        'mañana': 'tomorrow',
        'ayer': 'yesterday'
      },
      'en-es': {
        'hello': 'hola',
        'goodbye': 'adiós',
        'thank you': 'gracias',
        'thanks': 'gracias',
        'please': 'por favor',
        'yes': 'sí',
        'no': 'no',
        'good morning': 'buenos días',
        'good afternoon': 'buenas tardes',
        'good evening': 'buenas noches',
        'how are you?': '¿cómo estás?',
        'good': 'bien',
        'bad': 'mal',
        'i love you': 'te amo',
        'help': 'ayuda',
        'please help me': 'por favor ayúdame',
        'where are you?': '¿dónde estás?',
        'i am here': 'estoy aquí',
        'see you later': 'hasta luego',
        'see you': 'nos vemos',
        'nice to meet you': 'mucho gusto',
        'pleased to meet you': 'encantado',
        'i am sorry': 'lo siento',
        'sorry': 'perdón',
        'excuse me': 'disculpa',
        'you are welcome': 'de nada',
        'with pleasure': 'con gusto',
        'of course': 'claro',
        'maybe': 'tal vez',
        'perhaps': 'quizás',
        'now': 'ahora',
        'later': 'después',
        'today': 'hoy',
        'tomorrow': 'mañana',
        'yesterday': 'ayer'
      }
    };

    const pairKey = `${sourceLang}-${targetLang}`;
    const pairs = translationPairs[pairKey] || {};

    const lowerText = text.toLowerCase().trim();
    if (pairs[lowerText]) {
      return pairs[lowerText];
    }

    for (const [source, target] of Object.entries(pairs)) {
      if (lowerText.includes(source)) {
        return lowerText.replace(new RegExp(source, 'gi'), target);
      }
    }

    return `[${targetLang.toUpperCase()}] ${text}`;
  }, []);

  const shouldTranslate = useCallback((
    messageLanguage: SupportedLanguage,
    userPreferredLanguage: SupportedLanguage
  ): boolean => {
    return messageLanguage !== userPreferredLanguage;
  }, []);

  const getTranslatedContent = useCallback((
    originalContent: string,
    translatedContent: string | null,
    originalLanguage: SupportedLanguage,
    userLanguage: SupportedLanguage
  ): { content: string; isTranslated: boolean } => {
    if (originalLanguage === userLanguage) {
      return { content: originalContent, isTranslated: false };
    }

    if (translatedContent) {
      return { content: translatedContent, isTranslated: true };
    }

    return { content: originalContent, isTranslated: false };
  }, []);

  return {
    detectLanguage,
    translateText,
    shouldTranslate,
    getTranslatedContent,
    isTranslating,
    translationCache
  };
}
