'use client';

import { useParams } from 'next/navigation';
import ProjectPage from './projects_page';

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  
  return <ProjectPage id={id} />;
}