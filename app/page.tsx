import React from 'react';
import { SectionCards } from "@/components/SectionCards"
import { DataTable } from '@/components/DataTable';

export default function Home() {
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-5 py-4 md:gap-6 md:py-6">
              <SectionCards/>
              <DataTable/>
            </div>
          </div>
        </div>
  )
}
