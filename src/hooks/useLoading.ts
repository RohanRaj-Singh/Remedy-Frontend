'use client';

import { useCallback, useState } from 'react';

export function useLoading(initialState = false) {
    const [loading, setLoading] = useState(initialState);

    const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try {
            const result = await fn();
            return result;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, setLoading, withLoading };
}
