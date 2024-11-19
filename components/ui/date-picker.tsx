"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function DatePicker({ value, onChange, className, onKeyDown }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Initialize input value from prop
  React.useEffect(() => {
    try {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setInputValue(format(date, 'dd/MM/yyyy'))
      }
    } catch (e) {
      setInputValue(value)
    }
  }, [value])

  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Remove any non-numeric characters except slashes
    const cleanValue = newValue.replace(/[^\d/]/g, '')

    // Auto-add slashes
    let formattedValue = cleanValue
    if (cleanValue.length >= 2 && !cleanValue.includes('/')) {
      formattedValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2)
    }
    if (cleanValue.length >= 5 && formattedValue.split('/').length === 2) {
      formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5)
    }

    // Limit to 10 characters (DD/MM/YYYY)
    formattedValue = formattedValue.slice(0, 10)
    setInputValue(formattedValue)

    // Try to parse the date
    if (formattedValue.length === 10) {
      try {
        const parsedDate = parse(formattedValue, 'dd/MM/yyyy', new Date())
        if (!isNaN(parsedDate.getTime())) {
          onChange(format(parsedDate, 'yyyy-MM-dd'))
        }
      } catch (e) {
        // Invalid date format
      }
    }
  }

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setInputValue(format(date, 'dd/MM/yyyy'))
      onChange(format(date, 'yyyy-MM-dd'))
      setIsOpen(false)
    }
  }

  // Handle input click
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select()
    }
  }

  // Handle blur event
  const handleBlur = () => {
    try {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setInputValue(format(date, 'dd/MM/yyyy'))
      }
    } catch (e) {
      setInputValue('')
    }
  }

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onClick={handleInputClick}
        onKeyDown={onKeyDown}
        placeholder="DD/MM/YYYY"
        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 cursor-text"
        maxLength={10}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-6 w-6 p-0 hover:bg-muted/50 focus:ring-0",
              isOpen && "bg-muted/50"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="sr-only">Open calendar</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleCalendarSelect}
            initialFocus
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            className="rounded-md border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
