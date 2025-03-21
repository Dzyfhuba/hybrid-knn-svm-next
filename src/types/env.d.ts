export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_APP_TITLE: string
      readonly NEXT_PUBLIC_APP_DESCRIPTION: string

      readonly NEXT_PUBLIC_FIREBASE_API_KEY: string
      readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
      readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
      readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
      readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
      readonly NEXT_PUBLIC_FIREBASE_APP_ID: string
      readonly NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string

      readonly SUPABASE_URL: string
      readonly SUPABASE_KEY: string

      readonly NEXT_PUBLIC_ENABLE_ISPU_PREVIEW: string
    }
  }
}