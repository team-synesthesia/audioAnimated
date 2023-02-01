import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import {
  AuthForm,
  SplashPage,
  NotFound,
  SingleProject,
  AllProjects,
} from "../";
import { me } from "../../features";

import { fetchAllProjectsByUserIdAsync } from "../../features";

/**
 * COMPONENT
 */

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.me.id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        await dispatch(fetchAllProjectsByUserIdAsync(userId));
      };
      fetchData();
    }
  }, [dispatch, userId]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<AllProjects />} />
          <Route path="/signup" element={<AllProjects />} />

          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/:projectId" element={<SingleProject />} />
        </>
      ) : (
        <>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/login"
            element={<AuthForm name="login" displayName="Login" />}
          />
          <Route
            path="/signup"
            element={<AuthForm name="signup" displayName="Sign Up" />}
          />
        </>
      )}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
