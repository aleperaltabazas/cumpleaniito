/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COUSIN_NAME?: string
  readonly VITE_COUSIN_AGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
