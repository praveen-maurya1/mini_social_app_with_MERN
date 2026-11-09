
const theme = {
    colors: {
        // Brand
        primary: "#4F46E5",
        primaryHover: "#4338CA",
        primaryLight: "#EEF2FF",

        // Backgrounds
        background: "#F8FAFC",
        surface: "#FFFFFF",
        surfaceSecondary: "#F1F5F9",
        surfaceHover: "#F8FAFC",

        // Text
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textMuted: "#94A3B8",
        textDisabled: "#CBD5E1",

        // Borders
        border: "#E2E8F0",
        borderLight: "#F1F5F9",
        borderFocus: "#4F46E5",

        // Status
        success: "#16A34A",
        successLight: "#DCFCE7",
        danger: "#DC2626",
        dangerLight: "#FEE2E2",
        warning: "#D97706",
        warningLight: "#FEF3C7",
        info: "#2563EB",
        infoLight: "#DBEAFE",

        // Social actions
        like: "#EF4444",
        comment: "#4F46E5",
        share: "#0EA5E9",
        bookmark: "#F59E0B",

        // Common
        white: "#FFFFFF",
        black: "#000000",
        transparent: "transparent",
    },

    radius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        pill: "999px",
    },

    shadows: {
        sm: "0 1px 3px rgba(15, 23, 42, 0.06)",
        md: "0 4px 12px rgba(15, 23, 42, 0.08)",
        lg: "0 10px 30px rgba(15, 23, 42, 0.10)",
    },
};

// Default appearance
export const defaultTheme = {
    mode: "light",
    accent: theme.colors.primary,
};

// Available accent colors
export const themePresets = [
    { name: "Indigo", color: "#4F46E5" },
    { name: "Blue", color: "#2563EB" },
    { name: "Teal", color: "#0D9488" },
    { name: "Green", color: "#16A34A" },
    { name: "Rose", color: "#E11D48" },
    { name: "Purple", color: "#9333EA" },
    { name: "Orange", color: "#EA580C" },
    { name: "Cyan", color: "#0891B2" },
];

export default theme;
