import { React } from "jimu-core";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface FormInputAreaProps {
  name: string;
  control: any;
  label: string;
}
export const FormInputTextArea = ({ name, label, control }: FormInputAreaProps) => {
  return <Controller name={name} control={control} render={({ field }) => <TextField {...field} fullWidth label={label} margin="normal" multiline rows={4} placeholder="Write something about you" variant="filled" />} />;
};
