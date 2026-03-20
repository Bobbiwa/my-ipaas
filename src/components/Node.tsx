import React from 'react';

export default function Node({ type }: { type: string }) {
  return (
    <div className="w-20 h-20 bg-blue-500 rounded-xl text-white flex items-center justify-center">
      {type}
    </div>
  );
}
