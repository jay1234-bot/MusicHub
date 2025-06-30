"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/20">
      <motion.div
        className="absolute h-full bg-white"
        style={{ width: `${(props.value / props.max) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(props.value / props.max) * 100}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </SliderPrimitive.Track>
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <SliderPrimitive.Thumb
        className="block h-4 w-4 rounded-full border-2 border-white bg-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </motion.div>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
