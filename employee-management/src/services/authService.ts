import axios from "axios";
import { AuthResponse, LoginFormData } from "../types/User";

const API_URL = "http://localhost:3000/graphql";

export const registerUser = async (formData: FormData) => {
  try {
    const mutation = `
      mutation Register($email: String!, $password: String!, $profilePicture: Upload) {
        register(email: $email, password: $password, profilePicture: $profilePicture) {
          id
          email
          profilePicture
          token
        }
      }
    `;

    const operations = JSON.stringify({
      query: mutation,
      variables: {
        email: formData.get("email"),
        password: formData.get("password"),
        profilePicture: "0",
      },
    });

    const map = JSON.stringify({ "0": ["variables.profilePicture"] });

    const uploadForm = new FormData();
    uploadForm.append("operations", operations);
    uploadForm.append("map", map);

    const file = formData.get("profilePicture") as File;
    if (file) {
      uploadForm.append("0", file, file.name);
    }

    const response = await axios.post(API_URL, uploadForm, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response.data.data?.register;
    if (data?.token) {
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("tokenUpdated"));
    }
    return data;
  } catch (error: any) {
    console.error(" Error in registerUser:", error.response?.data);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (data: LoginFormData) => {
  try {
    const response = await axios.post<AuthResponse>(API_URL, {
      query: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
          }
        }
      `,
      variables: data,
    });

    if (!response.data.data?.login) throw new Error(" login failed");

    const loginData = response.data.data.login;
    localStorage.setItem("token", loginData.token);
    window.dispatchEvent(new Event("tokenUpdated"));

    return loginData;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.errors?.[0]?.message || "Login failed"
    );
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("tokenUpdated"));
};
