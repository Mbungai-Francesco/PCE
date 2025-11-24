import React from 'react'
import { cn } from '../../lib/utils'

export const MissionForm = () => {
  return (
    <div>
        <div className={cn('space-y-2')}>
            <h1 className={cn('text-2xl font-bold')}>Metadonnees Generales</h1>
            <p className='text-black/70'>Informations principales du vol de drone</p>
          </div>
    </div>
  )
}
