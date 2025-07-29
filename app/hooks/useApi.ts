import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../utils/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(error as ApiError);
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

export function usePaginatedApi<T>(
  apiCall: (page: number, pageSize: number) => Promise<{ data: T[]; meta: any }>,
  initialPage = 1,
  initialPageSize = 10
) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const { data, loading, error, execute } = useApi(
    () => apiCall(page, pageSize),
    { immediate: false }
  );

  const changePage = useCallback((newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  }, [pageSize]);

  useEffect(() => {
    execute();
  }, [page, pageSize, execute]);

  return {
    data: data?.data || [],
    meta: data?.meta,
    loading,
    error,
    page,
    pageSize,
    changePage,
    refresh: execute,
  };
}
