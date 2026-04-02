'use client'

import { RemoteParticipant } from "livekit-client"
import { useEffect, useRef, useState } from "react"
import type { TrackReference } from "@livekit/components-react"
import { VolumeControl } from "./VolumeControl"
import { FullScreenControl } from "./FullScreenControl"

interface StreamPlayerProps {
    participant: RemoteParticipant
    tracks: TrackReference[]
}

export function StreamPlayer({ participant, tracks }: StreamPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const [volume, setVolume] = useState(0)
    const [isFullScreen, setIsFullScreen] = useState(false)

    // ✅ Инициализация громкости
    useEffect(() => {
        if (!videoRef.current) return

        videoRef.current.muted = true
        videoRef.current.volume = 0
    }, [])

    // ✅ attach / detach треков (без утечек)
    useEffect(() => {
        if (!videoRef.current) return

        const videoEl = videoRef.current

        tracks.forEach(track => {
            track.publication.track?.attach(videoEl)
        })

        return () => {
            tracks.forEach(track => {
                track.publication.track?.detach(videoEl)
            })
        }
    }, [tracks])

    // ✅ fullscreen listener (без usehooks-ts)
    useEffect(() => {
        const handler = () => {
            setIsFullScreen(document.fullscreenElement !== null)
        }

        document.addEventListener("fullscreenchange", handler)

        return () => {
            document.removeEventListener("fullscreenchange", handler)
        }
    }, [])

    // 🎚️ громкость
    function onVolumeChange(value: number) {
        const vol = Number(value)
        setVolume(vol)

        if (videoRef.current) {
            videoRef.current.muted = vol === 0
            videoRef.current.volume = vol / 100
        }
    }

    function toggleMute() {
        const newVolume = volume === 0 ? 50 : 0
        onVolumeChange(newVolume)
    }

    // 🖥️ fullscreen
    function toggleFullScreen() {
        if (!wrapperRef.current) return

        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            wrapperRef.current.requestFullscreen()
        }
    }

    return (
        <div ref={wrapperRef} className="relative flex h-full w-full bg-black">
            <video
                ref={videoRef}
                className="h-full w-full"
                playsInline
                autoPlay
            />

            {/* UI overlay */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-linear-to-t from-black/40 via-transparent to-transparent flex items-end justify-between p-4">
                <VolumeControl value={volume} onChange={onVolumeChange} onToggle={toggleMute} />
                <FullScreenControl isFullScreen={isFullScreen} onToggle={toggleFullScreen} />
            </div>
        </div>
    )
}