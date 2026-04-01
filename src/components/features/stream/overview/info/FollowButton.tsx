import { Button } from "@/src/components/ui/common/Button"
import { ConfirmModal } from "@/src/components/ui/elements/ConfirmModal"
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useFindMyFollowingsQuery, useFollowChannelMutation, useUnfollowChannelMutation } from "@/src/graphql/generated/output"
import { useAuth } from "@/src/hooks/useAuth"
import { useCurrent } from "@/src/hooks/useCurrent"
import { Heart, HeartOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


interface FollowButtonProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function FollowButton({channel}: FollowButtonProps){
    const t = useTranslations('stream.actions.follow')
    const router = useRouter()

    const {isAuthenticated} = useAuth()
    const {user, isLoadingProfile} = useCurrent()

    const {data, loading: isLoadingFollowings, refetch} = useFindMyFollowingsQuery({
        skip: !isAuthenticated 
    })

    const followings = data?.findMyFollowings

    if (!channel?.id) {
        console.warn('Channel not loaded or missing ID', channel);
        return null; // skeleton или placeholder
    }

    const [follow, {loading: isLoadingFollow}] = useFollowChannelMutation({
        onCompleted() {
            refetch()
            toast.success(t('successFollowMessage'))
        },
        onError(error) {
            console.error('Follow error:', error)
            toast.error(t('errorFollowMessage'))
        }
    })

    const [unfollow, {loading: isLoadingUnfollow}] = useUnfollowChannelMutation({
        onCompleted() {
            refetch()
            toast.success(t('successUnfollowMessage'))
        },
        onError(error) {
            console.error('Unfollow error:', error)
            toast.error(t('errorUnfollowMessage'))
        }
    })

    const isOwnerChannel = !!(user && channel && user.id === channel.id)
    const isExistingFollow = followings?.some(following => following.following.id === channel.id)

    if(isOwnerChannel || isLoadingProfile) {
        return null
    }

    console.log('FollowButton channel:', channel)
    console.log('FollowButton channel.id:', channel?.id)

    const handleFollow = () => {
        if (!channel?.id) {
            console.error('Channel ID is missing:', channel)
            toast.error('Ошибка: ID канала не найден')
            return
        }
        
        console.log('Following channel with ID:', channel.id)
        follow({variables: {channelId: channel.id}})
    }

    const handleUnfollow = () => {
        if (!channel?.id) {
            console.error('Channel ID is missing:', channel)
            toast.error('Ошибка: ID канала не найден')
            return
        }
        
        console.log('Unfollowing channel with ID:', channel.id)
        unfollow({variables: {channelId: channel.id}})
    }

    return isExistingFollow ? (
        <ConfirmModal 
            heading={t('confirmUnfollowHeading')} 
            message={t('confirmUnfollowMessage')} 
            onConfirm={handleUnfollow}
        >
            <Button disabled={isLoadingFollowings || isLoadingUnfollow}>
                <HeartOff className="size-4" />
                {t('unfollowButton')}
            </Button>
        </ConfirmModal>
    ) : (
        <Button 
            onClick={() => isAuthenticated ? handleFollow() : router.push('/account/login')} 
            disabled={isLoadingFollowings || isLoadingFollow}
        >
            <Heart className="size-4" />
            {t('followButton')}
        </Button>
    )
}