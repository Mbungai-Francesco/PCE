import { FormPage } from './FormPage'
import { MissionProvider } from '@/context/MissionContext'

export const FormIndex = () => {
  return (
    <MissionProvider>
        <FormPage />
    </MissionProvider>
  )
}
