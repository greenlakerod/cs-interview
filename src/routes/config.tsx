import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Homepage from "@src/Homepage";
import LinkedListVisualizer from "@src/data-structures/linked-list/visualizer";
import LRUCacheVisualizer from "@src/data-structures/lru-cache/visualizer";
import BinaryTreeVisualizer from "@src/data-structures/trees/binary-tree/visualizer";
import { GraphVisualizer } from "@src/data-structures/graph/visualizer";
import { ArrayVisualizer } from "@src/data-structures/array/Visualizer";
import DataStructuresHome from "@src/data-structures";
import Layout from "@src/Layout";

export type RouteObjectEx = RouteObject & {
  menuLabel?: string;
  menuIcon?: React.ReactNode;
  children?: RouteObjectEx[];
};

export const HomeRoute: RouteObjectEx = {
  path: "/",
  element: <Homepage />,
};

export const DataStructuresRoutes: RouteObjectEx[] = [
  {
    menuLabel: "Linked List",
    path: "/ds/linked-list",
    element: <LinkedListVisualizer />,
  },
  {
    menuLabel: "LRU Cache",
    path: "/ds/lru-cache",
    element: <LRUCacheVisualizer />,
  },
  {
    menuLabel: "Binary Tree",
    path: "/ds/binary-tree",
    element: <BinaryTreeVisualizer />,
  },
  {
    menuLabel: "Graph",
    path: "/ds/graph",
    element: <GraphVisualizer />,
  },
  {
    menuLabel: "Array",
    path: "/ds/array",
    element: <ArrayVisualizer />,
  },
  {
    path: "/ds",
    element: <DataStructuresHome />,
  },
];

export const ValidRoutes: RouteObjectEx[] = [
  HomeRoute,
  ...DataStructuresRoutes,
  // {
  //   path: "404",
  //   element: <Homepage />,
  // },
];

export const CatchAllRoutes: RouteObjectEx[] = [
  {
    path: "404",
    element: <div>NOT FOUND</div>
    // element: <Homepage />,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },  
];

export const AllRoutes: RouteObjectEx[] = [
  HomeRoute,
  ...DataStructuresRoutes,
  ...CatchAllRoutes,
];

export const useRoutesConfig = (): RouteObject[] => {
  let routes: RouteObject[] = ValidRoutes.map((route) => {
    return {
      path: route.path,
      element: <Layout />,
      children: [
        {
          index: true,
          element: route.element,
        }
      ],
    };
  });

  routes = [...routes, ...AllRoutes];

  return routes;
};
