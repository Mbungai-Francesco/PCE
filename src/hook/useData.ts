import type { MissionContextType } from "@/context/MissionContext";
import { createContext, useContext } from "react";

export const MissionContext = createContext<MissionContextType | undefined>(undefined);

// Custom hook for easy access
export const useData = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useData must be used within MissionProvider');
  }
  return context;
};