import { useState, useEffect } from 'react';

interface JwtStorage {
    getJwt: () => string | null;
    setJwt: (token: string) => void;
    removeJwt: () => void;
    hasJwt: () => boolean;
}

const JWT_KEY = 'jwt_token';

export const useJwt = (): JwtStorage => {
    const [jwt, setJwtState] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem(JWT_KEY);
        if (token) {
            setJwtState(token);
        }
    }, []);

    const getJwt = (): string | null => {
        return localStorage.getItem(JWT_KEY);
    };

    const setJwt = (token: string): void => {
        localStorage.setItem(JWT_KEY, token);
        setJwtState(token);
    };

    const removeJwt = (): void => {
        localStorage.removeItem(JWT_KEY);
        setJwtState(null);
    };

    const hasJwt = (): boolean => {
        return localStorage.getItem(JWT_KEY) !== null;
    };

    return {
        getJwt,
        setJwt,
        removeJwt,
        hasJwt,
    };
};