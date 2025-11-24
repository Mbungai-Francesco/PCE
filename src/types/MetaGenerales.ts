import type { MissionDrone } from "."

export interface MetaGenerales {
    id ?: string        
    idMission : string                 
    titre : string           
    resume : string          
    categorieThematique : string
    mission ?: MissionDrone
}