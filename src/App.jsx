import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { SnackbarProvider, useSnackbar } from "notistack";

function App() {
  return (
    <>
      <SnackbarProvider>
        <Dashboard />
      </SnackbarProvider>
    </>
  );
}

export default App;
