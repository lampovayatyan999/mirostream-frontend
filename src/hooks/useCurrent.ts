import { useEffect, useRef } from "react";
import { useClearSessionCookieMutation, useFindProfileQuery } from "../graphql/generated/output";
import { useAuth } from "./useAuth";

export function useCurrent() {
    const { exit, auth } = useAuth(); 
    const isExiting = useRef(false);
    
    const { data, loading, error, refetch } = useFindProfileQuery({
        fetchPolicy: "no-cache"
    });
    
    const [clear] = useClearSessionCookieMutation();

    useEffect(() => {
        if (data?.findProfile) {
            auth(); 
        }
    }, [data, auth]);

    useEffect(() => {
        if (error && !isExiting.current) {
            isExiting.current = true;
            clear().finally(() => exit());
        }
    }, [error]);
    
    useEffect(() => {
    if (error) {
        console.log('useCurrent error:', error)
        console.log('error message:', error.message)
    }
}, [error]);

    return {
        user: data?.findProfile,
        isLoadingProfile: loading,
        error,
        refetch
    };
}