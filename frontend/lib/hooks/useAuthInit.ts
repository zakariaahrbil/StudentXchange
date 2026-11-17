"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";
import api from "../axios";
import { getCurrentUser } from "../api/auth";

export const useAuthInit = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!isAuthenticated) {
        try {
          const res = await axios.post<{ accessToken: string }>(
            `${api.defaults.baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = res.data;

          if (isMounted) {
            useAuthStore.getState().setAccessToken(accessToken);
          }

          const userProfile = await getCurrentUser();

          if (isMounted) {
            setAuth(userProfile, accessToken);
          }
        } catch {
          if (isMounted) {
            useAuthStore.getState().signOut();
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, setAuth, setLoading]);
};
