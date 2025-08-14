import React from 'react';
import { BatchProvider } from '@/contexts/BatchContext';
import ClientBody from '@/components/ClientBody';

export default function Home() {
  return (
    <BatchProvider>
      <ClientBody />
    </BatchProvider>
  );
}