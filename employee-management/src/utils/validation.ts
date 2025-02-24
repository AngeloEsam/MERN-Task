import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
    profilePicture: yup
    .mixed<FileList>()
    .test("fileRequired", "Profile picture is required", (value) => {
      return value instanceof FileList && value.length > 0;
    })
    .required("Profile picture is required"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});
