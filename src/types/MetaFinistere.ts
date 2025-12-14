export  interface MissionFinistere{

    // ? MissionDrone fields
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

    // ? MetaGenerales fields
    idMission : string                 
    titre : string           
    resume : string          
    categorieThematique : string

    // ? MetaTechniques fields
    datePublication : Date
    xMin            : number
    yMin            : number
    xMax            : number
    yMax            : number
    debut           ? : Date
    fin             ? : Date

    // ? MetaAdmin fields
    langue : string   
    SRS_CRSUtilise : string
    contraintesLegales : string
}