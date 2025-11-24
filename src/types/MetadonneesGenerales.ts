import type { MissionDrone } from "./"

export interface MetadonneesGenerales {
    id ?: string        
    idMission : string                 
    titre : string           
    resume : string          
    categorieThematique : string
    mission ?: MissionDrone
}