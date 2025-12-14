import type { MetaAdmin, MetaGenerales, MetaTechniques, MissionFinistere } from "."

export  interface MissionDrone{
    id ?: string
    dateDebutVol : Date // format local ISO string ! YYYY-MM-DD
    dateFinVol : Date // format local ISO string ! YYYY-MM-DD
    typeMission ?: string      
    capteurUtilise : string      
    statutValidation : boolean
    motDePasse : string    
    motsCles : string           
    nomProprietaire : string       
    emailProprietaire : string     
    entrepriseProprietaire : string
    admin ?: MetaAdmin | null          
    generale ?: MetaGenerales | null            
    technique ?: MetaTechniques | null    
    finistere ?: MissionFinistere | null
}