export const COUSIN_NAME: string = import.meta.env.VITE_COUSIN_NAME ?? 'tu primo'
export const COUSIN_AGE: number | null = import.meta.env.VITE_COUSIN_AGE
  ? Number(import.meta.env.VITE_COUSIN_AGE)
  : null
