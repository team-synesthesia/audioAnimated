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

/**
 * COMPONENT
 */

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<SplashPage />} />

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
