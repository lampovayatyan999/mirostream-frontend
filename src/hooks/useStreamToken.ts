import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useCurrent } from "./useCurrent";
import { useGenerateStreamTokenMutation } from "../graphql/generated/output";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { toast } from "sonner";
import { v4 as uuid4 } from 'uuid';

export function useStreamToken(channelId?: string) {
    const [token, setToken] = useState('')
    const [name, setName] = useState('')
    const [identity, setIdentity] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { isAuthenticated } = useAuth()
    const { user } = useCurrent()

    const [guestId] = useState(() => uuid4())

    const [generateStreamToken] = useGenerateStreamTokenMutation({
        onCompleted(data) {
            const viewerToken = data.generateStreamToken.token
            setToken(viewerToken)

            const decoded = jwtDecode(viewerToken) as JwtPayload & { name?: string }
            
            console.log('🔴 TOKEN DECODED:', {
                identity: decoded.jti,
                name: decoded.name,
                sub: decoded.sub,
                full: decoded
            })

            if (decoded.name) setName(decoded.name)
            if (decoded.jti) setIdentity(decoded.jti)

            setIsLoading(false)
        },
        onError(err) {
            toast.error(err.message)
            setIsLoading(false)
        }
    })

    useEffect(() => {
        if (!channelId) return

        setIsLoading(true)

        const userId = isAuthenticated && user ? user.id : guestId
        
        // 🔥 ЛОГ ДЛЯ ОТЛАДКИ
        console.log('🔴 useStreamToken CALL:', {
            channelId,
            userId,
            isAuthenticated,
            isOwner: user?.id === channelId,
            user: user?.id,
            guestId
        })

        generateStreamToken({
            variables: {
                data: { channelId, userId }
            }
        })
    }, [channelId, isAuthenticated, user, generateStreamToken, guestId])

    return { token, name, identity, isLoading }
}