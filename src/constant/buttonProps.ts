import React from "react";

export interface ButtonProps {
  content: React.ReactNode,
  onClick: () => void,
  className?: string
}