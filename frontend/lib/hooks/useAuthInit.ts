"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";
import api from "../axios";
import { getCurrentUser } from "../api/auth";

export const useAuthInit = () => {
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      const { isAuthenticated, setAuth, setLoading, signOut } = useAuthStore.getState();

      if (!isAuthenticated) {
        try {
          const res = await axios.post<{ accessToken: string }>(
            `${api.defaults.baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = res.data;

          // Set the access token so the Axios request interceptor attaches it
          useAuthStore.getState().setAccessToken(accessToken);

          const userProfile = await getCurrentUser();

          if (!isCancelled) {
            setAuth(userProfile, accessToken);
          }
        } catch {
          if (!isCancelled) {
            signOut();
          }
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, []);
};
