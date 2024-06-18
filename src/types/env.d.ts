export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      APP_NAME: string;
      APP_ENV: 'local' | 'production';

      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_BADGE: string;
      NEXT_PUBLIC_IDB_VERSION: number;

      SUPABASE_PROJECT_REF: string;
      SUPABASE_URL: string;
      SUPABASE_SERVICE_KEY: string;
    }
  }
}
    