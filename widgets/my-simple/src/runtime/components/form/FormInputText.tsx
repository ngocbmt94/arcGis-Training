import { React } from "jimu-core";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface FormInputTextProps {
  name: string;
  control: any;
  label: string;
}

export const FormInputText = ({ name, control, label }: FormInputTextProps) => {
  return <Controller name={name} control={control} render={({ field }) => <TextField {...field} fullWidth margin="normal" label={label} variant="outlined" />} />;
};
