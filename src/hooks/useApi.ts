import { useState, useCallback } from 'react';

export function useApi<TArgs extends any[], TResponse>(
  apiFn: (...args: TArgs) => Promise<TResponse>
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await apiFn(...args);
        setData(res);
        setSuccess(true);
        return res;
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
        setData(null);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  return { loading, data, error, success, run };
}
