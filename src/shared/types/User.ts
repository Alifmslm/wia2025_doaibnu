// src/shared/types/User.ts
export type User = {
    id: number;
    name: string;
    email: string;
    password: string; // plaintext untuk mock/dev. Jangan pakai di produksi
};
