import type { MissionDrone } from "."

export interface MetaAdmin {
    id ?: string                   
    idMission :string              
    langue : string   
    SRS_CRSUtilise : string
    contraintesLegales : string
    mission : MissionDrone
}