import { React } from "jimu-core";
import { Controller } from "react-hook-form";
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";

interface FormSelectProps {
  name: string;
  control: any;
  label: string;
}
export const FormSelect = ({ name, control, label }: FormSelectProps) => {
  return (
    <Controller
      render={({ field }) => (
        <FormControl {...field} fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select defaultValue="A" labelId="demo-simple-select-label" id="demo-simple-select" label={label}>
            <MenuItem value="A">option A</MenuItem>
            <MenuItem value="B">option B</MenuItem>
            <MenuItem value="C">option C</MenuItem>
          </Select>
        </FormControl>
      )}
      control={control}
      name={name}
    />
  );
};
