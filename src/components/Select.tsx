import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  SelectChangeEvent,
} from "@mui/material";
import { DropdownProps } from "../constant/dropdownProps";
import React from "react";

export function Select({ label, items, onChange, val }: DropdownProps) {
  const [age, setAge] = React.useState<string>("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setAge(event.target.value);
    onChange(event.target.value as string);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <MUISelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={val ? val : age}
        label={label}
        onChange={handleChange}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
}
