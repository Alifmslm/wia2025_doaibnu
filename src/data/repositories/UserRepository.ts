// File: src/data/repositories/UserRepository.ts
import { supabase } from '../../shared/supbase'; // Path ini sudah benar
import { type User } from '@supabase/supabase-js';

export const UserRepository = {
    
    /**
     * Mendaftarkan user baru
     */
    async register(email: string, password: string, username: string): Promise<{ user: User | null, error: any }> {
        console.log("Mencoba mendaftar...", { email, username });

        // 1. Daftarkan user ke auth.users
        // Trigger akan otomatis menangani pembuatan profil
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            // 2. KIRIM USERNAME DI SINI
            // Fungsi SQL 'handle_new_user' akan membaca data ini
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            console.error("Error Gagal signUp:", authError.message);
            return { user: null, error: authError };
        }

        if (!authData.user) {
            return { user: null, error: new Error("User tidak ditemukan setelah sign up.") };
        }

        // 3. HAPUS LANGKAH UPDATE
        // Kita tidak perlu '.update()' lagi, karena trigger sudah menanganinya.
        // Ini menghindari error RLS.
        /*
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ username: username })
            .eq('id', authData.user.id);

        if (profileError) {
            console.error("Gagal update username di profil:", profileError.message);
        }
        */

        console.log("Pendaftaran berhasil, trigger akan menangani profil.");
        return { user: authData.user, error: null };
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<{ user: User | null, error: any }> {
        console.log("Mencoba login...", { email });

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Error Gagal signIn:", error.message);
            return { user: null, error: error };
        }

        return { user: data.user, error: null };
    },

    /**
     * Mendapatkan sesi user saat ini
     */
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Perbaikan kecil: Coba refresh jika user tidak ada di cache
        if (!user) {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) console.error("Gagal refresh session:", error);
            return data?.user || null;
        }
        return user;
    },

    /**
     * Logout user
     */
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error Gagal logout:", error.message);
            throw error;
        }
        console.log("Berhasil logout");
    }
};