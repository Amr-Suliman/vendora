import React from 'react'

import { Star } from "lucide-react"

type Props = {
    filled?: boolean
}

export default function MyStarIcon({ filled = false }: Props) {
    return (
        <Star
            size={16}
            className={`
        transition-colors
        ${filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"}
      `}
        />
    )
}
