// src/data/repositories/UserRepository.ts
import raw from "../mock/user.json";
import type { User } from "../../shared/types/User";

const DB: User[] = raw.users as User[];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const UserRepository = {
    getAllSync(): User[] {
        return DB;
    },

    getByEmailSync(email: string): User | undefined {
        return DB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },

    async getByEmail(email: string): Promise<User | undefined> {
        await delay(150);
        return DB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },

    async login(email: string, password: string): Promise<User | null> {
        await delay(200);
        const user = DB.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        return user || null;
    },
};