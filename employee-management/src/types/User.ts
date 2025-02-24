export interface RegisterFormData {
  email: string;
  password: string;
  profilePicture: FileList;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    login: {
      userId: string;
      token: string;
    };
  };
}

