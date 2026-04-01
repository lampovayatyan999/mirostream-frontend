import { Card } from "@/src/components/ui/common/Card";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";


export function LoadingChat(){
    const t = useTranslations('stream.chat')

    return (
        <Card className="flex h-[82%] w-full flex-col overflow-y-auto lg:fixed lg:w-[21.5%] xl:mt-0 justify-center items-center">
            <Loader className="size-10 animate-spin text-muted-foreground" />
            <p className="text-lg mt-3 text-muted-foreground">{t('loading')}</p>
        </Card>
    )
}