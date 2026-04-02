"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/common/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/common/Popover";
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output";
import { Share } from "lucide-react";
import { useTranslations } from "next-intl";

// Dynamically import react-share to avoid build issues if package is missing
import dynamic from 'next/dynamic';
import { FaReddit, FaTelegram, FaTwitter, FaVk } from "react-icons/fa";

const TelegramShareButton = dynamic(
  () => import('react-share').then(mod => mod.TelegramShareButton),
  { ssr: false }
);
const TwitterShareButton = dynamic(
  () => import('react-share').then(mod => mod.TwitterShareButton),
  { ssr: false }
);
const VKShareButton = dynamic(
  () => import('react-share').then(mod => mod.VKShareButton),
  { ssr: false }
);
const RedditShareButton = dynamic(
  () => import('react-share').then(mod => mod.RedditShareButton),
  { ssr: false }
);

interface ShareActionsProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
}

const SHARE_BUTTON_CLASS = 
  "flex h-12 w-full items-center justify-center rounded-md transition-all hover:-translate-y-1 active:scale-95 text-white";

export function ShareActions({ channel }: ShareActionsProps) {
  const t = useTranslations("stream.actions.share");
  const [shareUrl, setShareUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined" && channel?.username) {
      setShareUrl(`${window.location.origin}/${channel.username}`);
    }
  }, [channel?.username]);

  if (!channel?.username || !shareUrl || !isMounted) return null;

  // Проверяем, что компоненты загружены
  if (!TelegramShareButton || !TwitterShareButton || !VKShareButton || !RedditShareButton) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="lgIcon">
            <Share className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-80">
          <h2 className="font-semibold text-base mb-4">{t("heading")}</h2>
          <div className="text-center text-muted-foreground">
            Loading share options...
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="lgIcon">
          <Share className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-80">
        <h2 className="font-semibold text-base mb-4">{t("heading")}</h2>
        <div className="grid grid-cols-4 gap-3">
          <TelegramShareButton url={shareUrl} className="w-full">
            <div className={`${SHARE_BUTTON_CLASS} bg-[#24A1DE]`}>
              <FaTelegram className="size-6" />
            </div>
          </TelegramShareButton>

          <TwitterShareButton url={shareUrl} className="w-full">
            <div className={`${SHARE_BUTTON_CLASS} bg-black`}>
              <FaTwitter className="size-6" />
            </div>
          </TwitterShareButton>

          <VKShareButton url={shareUrl} className="w-full">
            <div className={`${SHARE_BUTTON_CLASS} bg-[#4C75A3]`}>
              <FaVk className="size-6" />
            </div>
          </VKShareButton>

          <RedditShareButton url={shareUrl} className="w-full">
            <div className={`${SHARE_BUTTON_CLASS} bg-[#FF4500]`}>
              <FaReddit className="size-6" />
            </div>
          </RedditShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}