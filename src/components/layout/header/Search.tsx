'use client'

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { Input } from "../../ui/common/Input"
import { Button } from "../../ui/common/Button"
import { SearchIcon } from "lucide-react"

export default function Search() {
    const t = useTranslations('layout.search') 
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (searchTerm.trim()) {
            router.push(`/streams?searchTerm=${encodeURIComponent(searchTerm)}`)
        } else {
            router.push('/streams')
        }
    }

    return (
        <div className="ml-auto hidden lg:block">
            <form className="relative flex items-center" onSubmit={onSubmit}>
                <Input 
                    placeholder={t('placeholder')} 
                    type='text' 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full rounded-full pl-4 pr-12 lg:w-100" 
                />
                <Button 
                    className='absolute right-1 h-8 w-8 rounded-full p-0'
                    type='submit'
                    variant='ghost' 
                >
                    <SearchIcon className="size-4.5" /> 
                </Button>
            </form>
        </div>
    )
}