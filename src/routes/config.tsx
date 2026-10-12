import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

// import DesignPatternsPage from "@/views/DesignPatterns";
// import HomePage from "@/views/Home";
// import { MobxTimerPage } from "@/views/Mobx";
import Homepage from "@src/Homepage";
import LinkedListVisualizer from "@src/data-structures/linked-list/visualizer";

export const useRoutesConfig = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/linked-list",
      element: <LinkedListVisualizer />
    },
    // {
    //   path: "mobx",
    //   element: <MobxTimerPage />,
    // },
    // {
    //   path: "design-patterns",
    //   element: <DesignPatternsPage />,
    // },
    {
      path: "404",
      element: <Homepage />,
    },
    {
      path: "*",
      element: <Navigate to="/404" />,
    },
  ];
  return routes;
};
