export  interface MissionDrone{
    id ?: string
    dateDebutVol : Date       
    dateFinVol : Date     
    typeMission : string      
    capteurUtilise : string      
    statutValidation : boolean
    motDePasse : string    
    motsCles : string           
    nomProprietaire : string       
    emailProprietaire : string     
    entrepriseProprietaire : string
    // admin                  
    // generale               
    // technique    
}