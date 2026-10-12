import React from "react";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { Routes } from "./routes";

const Application: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<>loading...</>}>
        <Routes />
      </Suspense>
    </BrowserRouter>
  );
};

export default Application;
