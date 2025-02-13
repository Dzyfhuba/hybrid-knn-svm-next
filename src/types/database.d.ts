export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  svm_knn: {
    Tables: {
      data_test: {
        Row: {
          co: number | null
          created_at: string
          id: number
          kualitas: string | null
          model_id: number | null
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          so2: number | null
        }
        Insert: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          model_id?: number | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Update: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          model_id?: number | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'data_test_model_id_fkey'
            columns: ['model_id']
            isOneToOne: false
            referencedRelation: 'model'
            referencedColumns: ['id']
          }
        ]
      }
      data_train: {
        Row: {
          co: number | null
          created_at: string
          id: number
          kualitas: string | null
          model_id: number | null
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          so2: number | null
        }
        Insert: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          model_id?: number | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Update: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          model_id?: number | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'data_train_model_id_fkey'
            columns: ['model_id']
            isOneToOne: false
            referencedRelation: 'model'
            referencedColumns: ['id']
          }
        ]
      }
      model: {
        Row: {
          created_at: string
          id: number
          model: Json | null
          reference: string | null
          svm_report: Json | null
          knn_report: Json | null
          train_percentage: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          model?: {
            svm?: {
              learningRate: number
              regularization: number
              epochs: number
              checkpointInterval: number
              models: { weights: number[]; bias: number }[]
              classes: number[]
              lossHistoryCheckpoint: {class: number; data: number[]}[]
            }
            knn?: { [key: string]: any }
          } | null
          reference?: string | null
          svm_report?: Json | null
          knn_report?: Json | null
          train_percentage?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          model?: Json | null
          reference?: string | null
          svm_report?: Json | null
          knn_report?: Json | null
          train_percentage?: number | null
        }
        Relationships: []
      }
      normalized: {
        Row: {
          co: number | null
          created_at: string
          id: number
          kualitas: string | null
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          so2: number | null
        }
        Insert: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Update: {
          co?: number | null
          created_at?: string
          id?: number
          kualitas?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Relationships: []
      }
      prediction_knn: {
        Row: {
          co: number | null
          created_at: string
          id: number
          actual: string | null
          prediction: string | null
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          so2: number | null
        }
        Insert: {
          co?: number | null
          created_at?: string
          id?: number
          actual?: string | null
          prediction?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Update: {
          co?: number | null
          created_at?: string
          id?: number
          actual?: string | null
          prediction?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
        }
        Relationships: []
      }
      prediction_svm: {
        Row: {
          actual: string | null
          co: number | null
          created_at: string
          id: number
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          prediction: string | null
          so2: number | null
        }
        Insert: {
          actual?: string | null
          co?: number | null
          created_at?: string
          id?: number
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          prediction?: string | null
          so2?: number | null
        }
        Update: {
          actual?: string | null
          co?: number | null
          created_at?: string
          id?: number
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          prediction?: string | null
          so2?: number | null
        }
        Relationships: []
      }
      raw: {
        Row: {
          co: number | null
          created_at: string
          deleted_at: string | null
          id: number
          kualitas: string | null
          no2: number | null
          o3: number | null
          pm10: number | null
          pm2_5: number | null
          so2: number | null
          updated_at: string | null
        }
        Insert: {
          co?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          kualitas?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
          updated_at?: string | null
        }
        Update: {
          co?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          kualitas?: string | null
          no2?: number | null
          o3?: number | null
          pm10?: number | null
          pm2_5?: number | null
          so2?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
