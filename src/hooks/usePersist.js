import { useState, useEffect } from "react"

export const usePersist = () => {
    let storageValue = localStorage.getItem("persist")
    const result = storageValue === 'true'

    const [persist, setPersist] = useState(result)

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}