import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

// import DesignPatternsPage from "@/views/DesignPatterns";
// import HomePage from "@/views/Home";
// import { MobxTimerPage } from "@/views/Mobx";
import Homepage from "@src/Homepage";
import LinkedListVisualizer from "@src/data-structures/linked-list/visualizer";
import LRUCacheVisualizer from "@src/data-structures/lru-cache/visualizer";
import BinaryTreeVisualizer from "@src/data-structures/trees/binary-tree/visualizer";
import { GraphVisualizer } from "@src/data-structures/graph/visualizer";
import { ArrayVisualizer } from "@src/array/Visualizer";

export const useRoutesConfig = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/linked-list",
      element: <LinkedListVisualizer />,
    },
    {
      path: "/lru-cache",
      element: <LRUCacheVisualizer />,
    },
    {
      path: "/binary-tree",
      element: <BinaryTreeVisualizer />,
    },
    {
      path: "/graph",
      element: <GraphVisualizer />,
    },
    {
      path: "/array",
      element: <ArrayVisualizer />,
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
