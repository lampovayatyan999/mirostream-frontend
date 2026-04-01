import { Separator } from "@/src/components/ui/common/Separator"
import { useFindSocialLinksQuery, useReorderSocialLinksMutation } from "@/src/graphql/generated/output"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { SocialLinkItem } from "./SocialLinkItem"
import { toast } from "sonner"

export function SocialLinksList() {
    const t = useTranslations('dashboard.settings.profile.socialLinks')
    const {data, refetch} = useFindSocialLinksQuery()
    const items = data?.findSocialLinks ?? []
    const [socialLinks, setSocialLinks] = useState(items)

    useEffect(() => {
        setSocialLinks(items)
    }, [items])

    const [reorder, { loading: isLoadingReorder } ] = useReorderSocialLinksMutation({
        onCompleted() {
            refetch()
            toast.success(t('successReorderMessage'))
        },
        onError() {
            toast.error(t('errorReorderMessage'))
        }
    })

    function onDragEnd(result: DropResult) {
        if(!result.destination) return 

        const newItems = Array.from(socialLinks)
        const [reorderItem] = newItems.splice(result.source.index, 1)
        newItems.splice(result.destination.index, 0, reorderItem)

        const bulkUpdateData = newItems.map((socialLink, index) => ({
            id: socialLink.id,
            position: index
        }))

        setSocialLinks(newItems)
        reorder({variables: {list: bulkUpdateData } })
    }

    return socialLinks.length ? (
        <>
            <Separator />
            <div className="px-5 mt-5">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="socialLinks">
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {socialLinks.map((socialLink, index) => (
                                    <Draggable 
                                        key={socialLink.id} 
                                        draggableId={socialLink.id} 
                                        index={index} 
                                        isDragDisabled={isLoadingReorder} 
                                    >
                                        {provided => (
                                            <SocialLinkItem socialLink={socialLink} provided={provided}/>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    ) : null
}