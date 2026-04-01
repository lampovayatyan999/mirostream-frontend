import { Button } from "@/src/components/ui/common/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/common/Dialog";
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output";
import { useCurrent } from "@/src/hooks/useCurrent";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeStreamThumbnailForm } from "./ChangeStreamThumbnailForm";
import { ChangeStreamInfoForm } from "./ChangeStreamInfo";

interface StreamSettingsProps {
    channel: FindChannelByUsernameQuery["findChannelByUsername"] 
}

export function StreamSettings({channel}: StreamSettingsProps) {
    const t = useTranslations('stream.settings')

    const {user} = useCurrent()

    const isOwnerChannel = user?.id === channel.id

    if(!isOwnerChannel) {
        return null
    }
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='ghost' size='lgIcon'>
                <Pencil className="size-5" />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('heading')}</DialogTitle>
            </DialogHeader>
            <ChangeStreamThumbnailForm stream={channel.stream} />
            <ChangeStreamInfoForm stream={channel.stream} />
        </DialogContent>
    </Dialog>
  );
}