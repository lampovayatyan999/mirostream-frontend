'use client' // Обязательно, так как используем хуки и события

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../common/Button";

interface CopyButtonProps {
    value: string | null;
}

export function CopyButton({ value }: CopyButtonProps) {
    const t = useTranslations('components.copyButton');
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            toast.success(t('successMessage'));
            
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
            toast.error("Ошибка при копировании");
        }
    };

    const Icon = isCopied ? Check : Copy;

    return (
        <Button 
            type="button"
            variant='ghost' 
            size='icon' 
            onClick={onCopy} 
            disabled={!value || isCopied}
            className="shrink-0" 
        >
            <Icon className="size-5" />
        </Button>
    );
}