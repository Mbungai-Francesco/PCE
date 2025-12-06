// contexts/UserContext.jsx
import { MissionContext } from '@/hook/useData';
import type { MetaGenerales, MissionDrone } from '@/types';
import { useState } from 'react';

export interface MissionContextType {
  missionData: MissionDrone | null;
  setMissionData: (data: MissionDrone) => void;
  generaleData: MetaGenerales | null;
  setGeneraleData: (data: MetaGenerales) => void;
}

export const MissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [missionData, setMissionData] = useState<MissionDrone | null>(null);
  const [generaleData, setGeneraleData] = useState<MetaGenerales | null>(null);

  return (
    <MissionContext.Provider value={{ missionData, setMissionData, generaleData, setGeneraleData }}>
      {children}
    </MissionContext.Provider>
  );
};