import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export const FormPage = () => {
  const [fromNum, setFormNum] = useState(1);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(progressRef.current){
      const width = (fromNum / 3) * 100 ;
      progressRef.current.style.width = `${width}%`;
    }
  }, [fromNum])

  return (
    <div className={'bg-linear-to-br from-blue-400 to-purple-700 h-full w-full p-4 '}>
      <div className={cn('w-1/2 rounded-t-xl h-fit min-h-10 mx-auto bg-sky-900 py-7 px-8')}>
        <div className={cn('w-full flex justify-between items-center')}>
          <p className={cn('text-sky-900 bg-white w-fit h-fit py-2 px-5 rounded-md font-bold tracking-wider text-2xl')}>CEREMA</p>
          <div className={cn('w-1/2 flex flex-col gap-2')}>
            <p>Étape {fromNum} sur 3</p>
            <div className={cn('w-full h-2 bg-blue-100/80 rounded-full ')}>
              <div ref={progressRef} className={cn('bg-linear-to-br from-green-600 to-green-300 h-2 rounded-full')}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
