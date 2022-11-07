export interface Resource {
  label: string | null;
  value: {
    length?: string | null;
    lineData?: string | null;
    spec: string | null;
    equipment: string | null;
    port: string | null;
  };
}
