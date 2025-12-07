import type { MissionDrone } from "."

export interface MetaTechniques{
    id ?: string      
    idMission : string
    datePublication : Date
    xMin            : number
    yMin            : number
    xMax            : number
    yMax            : number
    debut           ? : Date
    fin             ? : Date
    mission ?: MissionDrone
}