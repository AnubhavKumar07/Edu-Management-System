// useApi — custom hook for authenticated API calls
import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
          },
          ...options,
        };

        // Remove Content-Type for FormData (file uploads)
        if (options.body instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        const res = await fetch(`${API_URL}${endpoint}`, config);
        const data = await res.json();

        if (res.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }

        if (!data.success) {
          throw new Error(data.message || 'Something went wrong');
        }

        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, logout]
  );

  // Convenience methods
  const get = useCallback(
    (endpoint) => request(endpoint, { method: 'GET' }),
    [request]
  );

  const post = useCallback(
    (endpoint, body) =>
      request(endpoint, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
        ...(body instanceof FormData ? { headers: {} } : {}),
      }),
    [request]
  );

  const put = useCallback(
    (endpoint, body) =>
      request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    [request]
  );

  const del = useCallback(
    (endpoint) => request(endpoint, { method: 'DELETE' }),
    [request]
  );

  return { get, post, put, del, loading, error, setError };
};

export default useApi;
