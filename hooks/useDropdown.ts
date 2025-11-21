import { useState, useCallback } from "react"

type DropdownType = "home" | "pages" | "room" | "destination" | "blog" | null

export function useDropdown() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)

  const openDropdown = useCallback((type: DropdownType) => {
    setActiveDropdown(type)
  }, [])

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null)
  }, [])

  const toggleDropdown = useCallback((type: DropdownType) => {
    setActiveDropdown((current) => (current === type ? null : type))
  }, [])

  return {
    activeDropdown,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    isOpen: (type: DropdownType) => activeDropdown === type,
  }
}

