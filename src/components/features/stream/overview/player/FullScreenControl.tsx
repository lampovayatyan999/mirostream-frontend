import { Button } from "@/src/components/ui/common/Button"
import { Hint } from "@/src/components/ui/elements/Hint"
import { Maximize, Minimize } from "lucide-react"
import { useTranslations } from "next-intl"

interface FullscreenProps {
    isFullScreen: boolean
    onToggle: () => void
}

export function FullScreenControl({ isFullScreen, onToggle}: FullscreenProps) {
    const t = useTranslations('stream.video.player.fullscreen')

    const Icon = isFullScreen ? Minimize : Maximize
    
    return <div className="flex items-center justify-center gap-4">
        <Hint label={isFullScreen ? t('exit') : t('open')} asChild >
            <Button variant='ghost' size='icon' onClick={onToggle} className='text-white hover:bg-white/10'>
                <Icon className="size-6" />
            </Button>
        </Hint>
    </div>
}