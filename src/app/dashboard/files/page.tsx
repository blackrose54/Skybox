'use client';

import React,{ FC,ReactElement } from 'react'
import {useQuery} from 'convex/react'
import { api } from "../../../../convex/_generated/api";
import FileList from '../../../components/FileList'
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

interface pageProps {
  
}

const Page: FC<pageProps> = ({}):ReactElement => {
    const files = useQuery(api.files.getFile,{
        orgId:"",
        onlyAuthor:true
    })
    const {userId,orgId,orgRole} = useAuth()
    const params = useSearchParams();

  return <FileList files={files?.filter(file=>!file.deleted)} clerkId={userId} orgId={orgId} query={params.get("search")} role={orgRole}/>
}

export default Page;