import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { openEditModal } from "../feature/slices/addTask.slice";

export function Dropdown({
  label,
  items,
  onChange,
  onClick,
  className,
  classForDropdown,
  classNameList,
  classNameListForDelete,
}: {
  label: React.ReactNode;
  items?: any;
  onChange: (value: any) => void;
  onClick?: () => void;
  className?: string;
  classForDropdown?: string;
  classNameList?: string;
  style?: Record<string, string>;
  classNameListForDelete?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const closeDropdown = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => {
          if (onClick) onClick();
          else toggleDropdown();
        }}
        className={`px-2 py-2 flex items-center justify-center rounded-full border border-gray-300 shadow-sm ${className}`}
      >
        {/* Custom icon or content */}
        {data ? data : label}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 left-14 top-3 w-36 bg-[rgba(255,249,249,1)] border-2 border-[rgba(123,25,132,0.15)] rounded-lg shadow-lg z-50 ${classForDropdown}`}
        >
          <ul className="py-2">
            {items?.map((option: any, index: number) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                  option.value === "delete" ? classNameListForDelete : null
                }  ${classNameList}`}
                onClick={() => {
                  onChange(option.value);
                  option.icon
                    ? option.value === "edit" && dispatch(openEditModal())
                    : setData(option.label);
                  setIsOpen(false);
                }}
              >
                {option.icon ? option.icon : null} {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
