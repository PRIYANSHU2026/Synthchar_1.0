/// <reference types="vite/client" />

// Declare modules for image imports
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

// Declare modules for font imports
declare module 'next/font/google' {
  export interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    variable?: string;
  }

  export function Inter(options: FontOptions): {
    className: string;
    variable: string;
  };
}