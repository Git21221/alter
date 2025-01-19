import { FiSearch } from "react-icons/fi";

export function Search({onChange}: {onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <div className="bg-transparent p-2 border border-[var(--border-color)] rounded-full uppercase font-semibold font-[mulish] w-min cursor-pointer flex items-center gap-1">
      <FiSearch
        style={{ fontSize: "18px", color: "var(--search-icon-color)" }}
      />
      <input
        type="text"
        placeholder="Search"
        className="w-max outline-none border-none"
        onChange={onChange}
      />
    </div>
  );
}
