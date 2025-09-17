/* eslint-disable @typescript-eslint/no-unused-vars */
import useApiUrl from "@/hooks/use-ApiUrl";
import axios, { AxiosError } from "axios";
import React, { useContext, createContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import useApiUrl from "src/hooks/use-ApiUrl";

// eslint-disable-next-line react-refresh/only-export-components
export const localStorageKey = {
  accessTokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  tokenSaveTimeKey: "access_token_save_time",
};

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  tokenSavedTime: Date | null;
  user: string | null;
  message: string | null;
  isLoading: boolean;
  loginAction: (data: { email: string; username: string; password: string }) => Promise<void>;
  registerAction: (data: { username: string; email: string, password: string }) => Promise<void>;
  logOut: () => void;
  setNewAccessToken: (token: string) => void;
  setNewRefreshToken: (token: string) => void;
  removeAccessToken: () => void;
  removeRefreshToken: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect-to");
  console.log("rutl: ", redirectTo);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("user") || ""
  );
  const [message, setMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.accessTokenKey) || ""
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.refreshTokenKey) || ""
  );
  const [tokenSavedTime, setTokenSavedTime] = useState<Date | null>(
    new Date(localStorage.getItem(localStorageKey.tokenSaveTimeKey) || "")
  );
  const navigate = useNavigate();
  const api = useApiUrl();

  const loginAction = async (data: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      setMessage(null);

      const authData = {
        email: data.username,
        user: data.username,
        password: data.password,
      };

      const response = await axios.post(
        `${api.ProductionRootUrl}/api/Auth/login`,
        authData,
        {
          withCredentials: true
        }
      );

      if (response.data) {
        setUser(data.username);
        setAccessToken(response.data.token);
        // setRefreshToken(response.data.refresh_token);
        setTokenSavedTime(new Date());

        await localStorage.setItem("user", data.username);
        setNewAccessToken(response.data.token);
        // setNewRefreshToken(response.data.refresh_token);

        // console.log(response.data);
        if (redirectTo) {
          navigate(`/${redirectTo}`);
        } else {
          navigate("/");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        throw new Error("Can not authenticate. Some error happened.");
      }

      // console.log(response);
    } catch (err) {
      setIsLoading(false);
      if (err === typeof AxiosError) {
        console.error("asdas", err as AxiosError);
      }
      if (err as AxiosError) {
        console.log((err as AxiosError).response?.data);
        setMessage(JSON.stringify((err as AxiosError).response?.data));
      }
    }
  };


  const registerAction = async (data: { username: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      setMessage(null);

      const authData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const response = await axios.post(
        `${api.ProductionRootUrl}/api/Auth/register`,
        authData
      );

      if (response.data) {
        if (redirectTo) {
          navigate(`/${redirectTo}`);
        } else {
          navigate("/sign-in");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        throw new Error("Registration failed. No response data received.");
      }
    } catch (err) {
      setIsLoading(false);

      if (err instanceof AxiosError) {
        console.error("Axios error:", err.response?.data);
        setMessage(JSON.stringify(err.response?.data));
      } else {
        console.error("Unexpected error:", err);
        setMessage("An unexpected error occurred.");
      }
    }
  };


  const setNewAccessToken = (token: string) =>
    localStorage.setItem(localStorageKey.accessTokenKey, token);

  const removeAccessToken = () =>
    localStorage.removeItem(localStorageKey.accessTokenKey);

  const setNewRefreshToken = (token: string) =>
    localStorage.setItem(localStorageKey.refreshTokenKey, token);

  const removeRefreshToken = () =>
    localStorage.removeItem(localStorageKey.refreshTokenKey);

  const logOut = () => {
    setIsLoading(true);
    localStorage.setItem("user", "");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    removeAccessToken();
    removeRefreshToken();
    navigate("/sign-in");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        tokenSavedTime,
        user,
        loginAction,
        registerAction,
        logOut,
        message,
        isLoading,
        setNewAccessToken,
        setNewRefreshToken,
        removeAccessToken,
        removeRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
