export interface DropdownProps {
  label: string
  items: { value: string, label: string }[]
  onChange: (value: string) => void
  val?: string
} 