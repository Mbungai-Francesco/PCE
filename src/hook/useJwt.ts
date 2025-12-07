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
        const token = sessionStorage.getItem(JWT_KEY);
        if (token) {
            setJwtState(token);
        }
    }, []);

    const getJwt = (): string | null => {
        return sessionStorage.getItem(JWT_KEY);
    };

    const setJwt = (token: string): void => {
        sessionStorage.setItem(JWT_KEY, token);
        setJwtState(token);
    };

    const removeJwt = (): void => {
        sessionStorage.removeItem(JWT_KEY);
        setJwtState(null);
    };

    const hasJwt = (): boolean => {
        return sessionStorage.getItem(JWT_KEY) !== null;
    };

    return {
        getJwt,
        setJwt,
        removeJwt,
        hasJwt,
    };
};