import MyStarIcon from "@/components/myStarIcon/myStarIcon"

type Props = {
  rating: number
  count?: number
}

export default function ProductRating({ rating, count }: Props) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <MyStarIcon key={i} filled={i <= fullStars} />
      ))}
      {count && (
        <span className="ml-1 -mt-0.5 text-sm text-muted-foreground">
          ({count})
        </span>
      )}
    </div>
  )
}