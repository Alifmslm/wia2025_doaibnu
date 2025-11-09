// src/theme.ts
import { createTheme } from "@mui/material/styles";

// Anda bisa mengimpor warna spesifik jika perlu
// import { red, blueGrey } from '@mui/material/colors';

// Buat instansi tema Anda
const theme = createTheme({
    // 'palette' adalah tempat Anda mendefinisikan skema warna
    palette: {
        primary: {
            main: "#2FB06D", // Ganti dengan warna primer Anda (misal: #5A67D8)
            light: "#2FB06D",
            dark: "#2FB06D",
            contrastText: "#ffffff", // Warna teks di atas warna 'main'
        },
        // 'secondary' adalah warna aksen
        secondary: {
            main: "#F18A3C", // GANTI INI dengan warna kustom Anda
        },
        mode: "light",

        // Contoh mengubah warna 'background'
        background: {
            default: "#f4f6f8", // Warna latar belakang halaman
            paper: "#ffffff", // Warna komponen seperti Card, Paper
        },
    },

    // 'typography' adalah untuk pengaturan font dan teks
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto", // Pastikan font Roboto sudah diimpor (lihat public/index.html)
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
        fontSize: 14,
        h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 5, // Mengubah radius sudut default
    },
});

export default theme;
