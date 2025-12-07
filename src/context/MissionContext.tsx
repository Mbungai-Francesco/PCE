// contexts/UserContext.jsx
import { MissionContext } from '@/hook/useData';
import type { MetaAdmin, MetaGenerales, MetaTechniques, MissionDrone } from '@/types';
import { useState } from 'react';

export interface MissionContextType {
  missionData: MissionDrone | null;
  setMissionData: (data: MissionDrone) => void;
  generaleData: MetaGenerales | null;
  setGeneraleData: (data: MetaGenerales) => void;
  techData: MetaTechniques | null;
  setTechData: (data: MetaTechniques) => void;
  adminData: MetaAdmin | null;
  setAdminData: (data: MetaAdmin) => void;
}

export const MissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [missionData, setMissionData] = useState<MissionDrone | null>(null);
  const [generaleData, setGeneraleData] = useState<MetaGenerales | null>(null);
  const [techData, setTechData] = useState<MetaTechniques | null>(null);
  const [adminData, setAdminData] = useState<MetaAdmin | null>(null);

  return (
    <MissionContext.Provider value={{ missionData, setMissionData, generaleData, setGeneraleData, techData, setTechData, adminData, setAdminData }}>
      {children}
    </MissionContext.Provider>
  );
};