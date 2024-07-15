'use client';

import { useAuth, useOrganization, useUser } from '@clerk/nextjs';
import FileList from '../../../components/FileList'
import React,{ FC,ReactElement } from 'react'
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSearchParams } from 'next/navigation';

interface pageProps {
  
}

const Page: FC<pageProps> = ({}):ReactElement => {

  const {orgRole,orgId,userId} = useAuth()
  const {user} = useUser()
  
  const params = useSearchParams()
  const files = useQuery(api.files.getFile,{
    orgId:orgId||"",
    query: params.get("search") ?? undefined,
  }) 

  return <FileList orgId={orgId} files={files?.filter(file=>file.deleted)} clerkId={userId} trash role={orgRole} query={params.get("search")}  /> 
}

export default Page