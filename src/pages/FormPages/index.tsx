import { createBrowserRouter } from "react-router-dom";
import { MissionForm } from "./MissionForm";

export const router = createBrowserRouter([
  {
    index: true,
    element: <MissionForm />
  }
])