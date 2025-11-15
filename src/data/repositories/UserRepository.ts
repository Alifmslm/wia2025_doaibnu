import { supabase } from '../../shared/supbase';
import { type User } from '@supabase/supabase-js';

// --- Tipe Data (Disederhanakan) ---
export interface UserProfileData {
    id: string;
    username: string | null;
    // 'avatar_url' dihapus
}
// ----------------------------------------------------

// --- Helper 'uploadProfilePicture' dihapus ---

export const UserRepository = {
    
    /**
     * Mendaftarkan user baru
     */
    async register(email: string, password: string, username: string): Promise<{ user: User | null, error: any }> {
        console.log("Mencoba mendaftar...", { email, username });

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    // 'avatar_url' dihapus dari sini
                    username: username,
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
        return { user: authData.user, error: null };
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<{ user: User | null, error: any }> {
        // ... (Fungsi login tidak berubah) ...
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
        // ... (Fungsi ini tidak berubah) ...
        const { data: { user } } = await supabase.auth.getUser();
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
        // ... (Fungsi ini tidak berubah) ...
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error Gagal logout:", error.message);
            throw error;
        }
        console.log("Berhasil logout");
    },


    // === FUNGSI PROFIL (DIMODIFIKASI) ===

    /**
     * Mengambil data profil (dari tabel 'profiles')
     */
    async getCurrentUserProfile(): Promise<{ auth: User, profile: UserProfileData } | null> {
        const user = await this.getCurrentUser();
        if (!user) {
            console.log("Tidak ada user, tidak bisa ambil profil.");
            return null;
        }

        console.log(`Mengambil profil untuk user: ${user.id}`);
        
        // Hanya select 'id' dan 'username'
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('id, username') // <-- Disederhanakan
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error mengambil profil:", error);
            return {
                auth: user,
                profile: {
                    id: user.id,
                    username: user.user_metadata.username || "User",
                }
            };
        }

        return { auth: user, profile: profileData as UserProfileData };
    },

    /**
     * Meng-update data profil pengguna
     */
    async updateUserProfile(
        userId: string, 
        currentEmail: string,
        // 'image' dihapus dari parameter
        dataToUpdate: { name: string, email: string } 
    ): Promise<{ auth: User, profile: UserProfileData }> {
        
        console.log("Mulai update profil...", dataToUpdate);

        // --- 1. Update Email (jika berubah) ---
        if (dataToUpdate.email.toLowerCase() !== currentEmail.toLowerCase()) {
            console.log("Email berubah, meng-update auth...");
            const { error: emailError } = await supabase.auth.updateUser({
                email: dataToUpdate.email
            });
            if (emailError) {
                console.error("Gagal update email:", emailError);
                throw emailError;
            }
        }

        // --- 2. Upload Gambar (DIHAPUS) ---
        
        // --- 3. Update Data di Tabel 'profiles' ---
        // 'avatar_url' dihapus dari payload
        const profileUpdatePayload: { username: string } = {
            username: dataToUpdate.name,
        };
        
        console.log("Meng-update tabel 'profiles'...", profileUpdatePayload);
        const { data: updatedProfile, error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdatePayload)
            .eq('id', userId)
            .select('id, username') // <-- Disederhanakan
            .single();

        if (profileError) {
            console.error("Gagal update profil:", profileError);
            throw profileError;
        }

        // --- 4. Ambil data Auth terbaru ---
        const { data: { user: updatedAuthUser } } = await supabase.auth.getUser();
        if (!updatedAuthUser) throw new Error("Gagal mengambil data user setelah update.");

        console.log("Update profil berhasil.");
        return { auth: updatedAuthUser, profile: updatedProfile as UserProfileData };
    }
};