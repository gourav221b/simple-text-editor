'use client'
import { useEffect } from "react";

const useRemoveSearchParams = () => {
    useEffect(() => {
        const { pathname, search, hash } = window.location;

        if (search || hash) {
            const cleanURL = pathname + hash;
            window.history.replaceState(null, '', cleanURL);
        }
    }, []);
};

export default useRemoveSearchParams;