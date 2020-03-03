import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortController = new AbortController();
    activeHttpRequest.current.push(httpAbortController);
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortController.signal,
      });

      const data = await response.json();

      activeHttpRequest.current = activeHttpRequest.current.filter(
        reqCtrl => reqCtrl !== httpAbortController,
      );

      if (!response.ok) throw new Error(data.message);

      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);

      setError(error.message);
      throw error;
    }
  }, []);

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return [isLoading, error, sendRequest, clearError];
};
