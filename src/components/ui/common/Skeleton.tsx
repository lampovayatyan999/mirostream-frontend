import { cn } from "@/src/utils/tw-merge"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("dark:bg-(--muted) bg-(--card) rounded-md animate-pulse ", className)}
      {...props}
    />
  )
}

export { Skeleton }

