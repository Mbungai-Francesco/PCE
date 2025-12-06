import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MissionForm, type MissionFormHandle } from './MissionForm';
import { GeneraleForm, type GeneraleFormHandle } from './GeneraleForm';
import { Button } from '@/components/ui/button';
import { loadToast } from '@/lib/loadToast';
import { getMissionDroneById } from '@/api/MissionDroneApi';
import { useData } from '@/hook/useData';

export const FormPage = () => {
  const [formNum, setFormNum] = useState(1);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const missionFormRef = useRef<MissionFormHandle>(null);
  const generaleFormRef = useRef<GeneraleFormHandle>(null);

  const { missionData, setMissionData } = useData();

  useEffect(() => {
    if(progressRef.current){
      const width = (formNum / 4) * 100 ;
      progressRef.current.style.width = `${width}%`;
    }
  }, [formNum])

  const submit = async () => {
    // Validate and submit current form
    
    if (formNum === 1 && missionFormRef.current) {
      const isValid = await missionFormRef.current.submit();
      
      if (!isValid) return
      else loadToast('Mission Created', '', 3000, 'green')
    }
    if (formNum === 2 && generaleFormRef.current) {
      const isValid = await generaleFormRef.current.submit();
      if (!isValid) return;
      else loadToast('Generales Created', '', 3000, 'green')
    }
    // Add similar checks for other forms (formNum === 2, etc.)
    
    if(formNum < 4){
      setFormNum(formNum + 1);
    }
  }

  useEffect(() =>{
    getMissionDroneById('9a999ab7-e2d0-4e1f-9ef4-3915bd15ad8b').then((res) => {
      console.log('Fetched Mission Drone:', res);
      setMissionData(res)
    })
  },[setMissionData])

  return (
    <div className={'bg-linear-to-br from-blue-400 to-purple-700 min-h-screen w-full pt-10'}>
      <div className={cn('w-1/2 h-fit min-h-10 mx-auto')}>
        <div className={cn('w-full flex justify-between items-center py-7 px-8 bg-sky-900 rounded-t-xl')}>
          <p className={cn('text-sky-900 bg-white w-fit h-fit py-2 px-5 rounded-md font-bold tracking-wider text-2xl')}>CEREMA</p>
          <div className={cn('w-1/2 flex flex-col gap-2')}>
            <p>Étape {formNum} sur 4</p>
            <div className={cn('w-full h-2 bg-blue-100/80 rounded-full ')}>
              <div ref={progressRef} className={cn('bg-linear-to-br from-green-600 to-green-300 h-2 rounded-full')}></div>
            </div>
          </div>
        </div>
        <div className={cn('w-full min-h-10 bg-white rounded-b-xl py-7 px-8 text-black')}>
          {(formNum === 1 && missionData?.id) && <MissionForm ref={missionFormRef} />}
          {formNum === 2 && <GeneraleForm ref={generaleFormRef} />}
          <div className='mt-4 flex justify-end space-x-4'>
            {formNum != 1 &&
             <Button 
              type="submit"
              onClick={()=>{setFormNum(formNum - 1)}}
             >Back</Button>
            }
            <Button type="submit" onClick={submit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
