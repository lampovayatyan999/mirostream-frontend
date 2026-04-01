'use client'

import { useEffect, useRef } from 'react'

export default function SimpleVideoTest() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (!videoRef.current) return

        // Создаём тестовый видеопоток
        const canvas = document.createElement('canvas')
        canvas.width = 1280
        canvas.height = 720
        const ctx = canvas.getContext('2d')!
        
        let hue = 0
        const animate = () => {
            hue = (hue + 1) % 360
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'white'
            ctx.font = '48px Arial'
            ctx.fillText(`Тест ${new Date().toLocaleTimeString()}`, 50, 100)
            requestAnimationFrame(animate)
        }
        animate()
        
        const stream = canvas.captureStream(30)
        videoRef.current.srcObject = stream
        videoRef.current.play()
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>Простое видео (без LiveKit)</h1>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', maxWidth: 1280, background: '#000', borderRadius: 8 }}
            />
            <p>✅ Если видишь цветные полосы — видео работает, проблема в LiveKit</p>
        </div>
    )
}