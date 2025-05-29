'use client';

import { useParams } from 'next/navigation';
import ReportsPage from './reports_page';

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  
  return <ReportsPage id={id} />;
}