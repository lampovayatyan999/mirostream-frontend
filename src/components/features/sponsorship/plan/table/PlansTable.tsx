'use client'

import { useCurrent } from "@/src/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { VerifiedChannelAlert } from "./VerifiedChannelAlert"
import { Heading } from "@/src/components/ui/elements/Headings"
import { CreatePlanForm } from "../forms/CreatePlanForm"
import { type FindMySponsorshipPlansQuery, useFindMySponsorshipPlansQuery, useRemoveSponsorshipPlanMutation } from "@/src/graphql/generated/output"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/src/utils/format-date"
import { convertPrice } from "@/src/utils/convert-price"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/common/DropdownMenu"
import { Button } from "@/src/components/ui/common/Button"
import { MoreHorizontal, Trash } from "lucide-react"
import { DataTableSkeleton } from "../../../follow/table/FollowersTable"
import { DataTable } from "@/src/components/ui/elements/DataTable"

export function PlansTable() {
    const t = useTranslations('dashboard.plans')
    const { user } = useCurrent()
    const { data, loading: isLoadingPlans, refetch } = useFindMySponsorshipPlansQuery()
    const plans = data?.findMyPlans ?? []

    const [remove, { loading: isLoadingRemove }] = useRemoveSponsorshipPlanMutation({
        onCompleted() {
            refetch()
            toast.success(t('columns.successMessage'))
        },
        onError() {
            toast.error(t('columns.errorMessage'))
        }
    })

    const plansColumns: ColumnDef<FindMySponsorshipPlansQuery['findMyPlans'][0]>[] = [
        {
            accessorKey: 'createdAt',
            header: t('columns.date'),
            cell: ({ row }) => formatDate(row.original.createdAt)
        },
        {
            accessorKey: 'title',
            header: t('columns.title'),
            cell: ({ row }) => row.original.title
        },
        {
            accessorKey: 'price',
            header: t('columns.price'),
            cell: ({ row }) => convertPrice(row.original.price)
        },
        {
            accessorKey: 'actions',
            header: t('columns.actions'),
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='size-8 p-0'>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuItem
                            onClick={() => remove({ variables: { planId: row.original.id } })}
                            className="text-red-500 focus:text-red-500"
                            disabled={isLoadingRemove}
                        >
                            <Trash className="mr-2 size-4" />
                            {t('columns.remove')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    if (!user?.isVerified) return <VerifiedChannelAlert />

    return (
        <div className="lg:px-10">
            <div className="block items-center justify-between space-y-3 lg:flex lg:space-y-0">
                <Heading 
                    title={t('header.heading')} 
                    description={t('header.description')}
                    size='lg' 
                />
                <CreatePlanForm />
            </div>
            <div className="mt-5">
                {isLoadingPlans ? (
                    <DataTableSkeleton />
                ) : (
                    <DataTable columns={plansColumns} data={plans} />
                )}
            </div>
        </div>
    )
}