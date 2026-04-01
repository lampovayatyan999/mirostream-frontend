import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useCurrent } from "./useCurrent";
import { useGenerateStreamTokenMutation } from "../graphql/generated/output";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { toast } from "sonner";
import {v4 as uuid4} from 'uuid'
export function useStreamToken(channelId: string ) {
    const [token, setToken] = useState('')
    const [name, setName] = useState('')
    const [identity, setIdentity] = useState('')
    const { isAuthenticated } = useAuth()
    const { user } = useCurrent()
    const [generateStreamToken] = useGenerateStreamTokenMutation({
        onCompleted(data) {
            const viewerToken = data.generateStreamToken.token
            setToken(viewerToken)
            const decoded = jwtDecode(viewerToken) as JwtPayload & { name?: string }
            if (decoded.name) setName(decoded.name)
            if (decoded.jti) setIdentity(decoded.jti)
        },
        onError(err) { toast.error(err.message) }
    })

    useEffect(() => {
        if (!channelId) return
        const userId = isAuthenticated && user ? user.id : uuid4()
        generateStreamToken({ variables: { data: { channelId, userId } } })
    }, [channelId, isAuthenticated, user, generateStreamToken])

    return { token, name, identity }
}