'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Wayshrine from '@/components/Wayshrine';

export default function LocationPage() {
  const { id } = useParams<{ id: string }>();
  return <Wayshrine locationId={id} />;
}
