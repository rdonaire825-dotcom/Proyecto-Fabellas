export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      productos: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string | null;
          precio: number;
          imagen_url: string | null;
          categoria: string;
          stock: number;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion?: string | null;
          precio: number;
          imagen_url?: string | null;
          categoria: string;
          stock?: number;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string | null;
          precio?: number;
          imagen_url?: string | null;
          categoria?: string;
          stock?: number;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
