import { React } from "jimu-core";
import { useForm } from "react-hook-form";
import { FormInputText } from "./FormInputText";
import { FormSelect } from "./FormSelect";
import { FormInputTextArea } from "./FormInputArea";
import { Button } from "@mui/material";

interface FormValues {
  lastName: string;
  firstName: string;
  category: string;
  aboutYou: string;
}

export default function TestForm(props: any) {
  const { dispatch } = props;
  const { register, handleSubmit, control } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    console.log(data);
    dispatch({ type: "IS_LOADING" });
    dispatch({
      type: "SUBMIT_FORM_TEST",
      val: data,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "3rem 0", maxWidth: "400px" }}>
      <FormInputText name="firstName" control={control} label="First Name" />
      <FormInputText name="lastName" control={control} label="Last Name" />
      <FormSelect name="category" control={control} label="Category" />
      <FormInputTextArea name="aboutYou" control={control} label="About You" />
      <Button type="submit" variant="contained">
        SUBMIT FORM
      </Button>
    </form>
  );
}
