
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import theme, { defaultTheme } from "../config/theme";

const ThemeContext = createContext(null);

const STORAGE_KEY = "cache-app-theme";

// Convert HEX to RGB
const hexToRgb = (hex) => {
    const value = hex.replace("#", "");

    return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
    };
};

// Convert RGB to HEX
const rgbToHex = ({ r, g, b }) => {
    return (
        "#" +
        [r, g, b]
            .map((value) =>
                Math.round(value).toString(16).padStart(2, "0")
            )
            .join("")
    );
};

// Mix two colors
const mixColors = (color1, color2, weight) => {
    const a = hexToRgb(color1);
    const b = hexToRgb(color2);

    return rgbToHex({
        r: a.r * (1 - weight) + b.r * weight,
        g: a.g * (1 - weight) + b.g * weight,
        b: a.b * (1 - weight) + b.b * weight,
    });
};

// Darken color
const darkenColor = (color, amount = 0.12) => {
    return mixColors(color, "#000000", amount);
};

// Generate complete theme
const generateTheme = (mode, accent) => {
    const isDark = mode === "dark";

    // Base colors
    const baseBackground = isDark ? "#0F172A" : "#F8FAFC";
    const baseSurface = isDark ? "#1E293B" : "#FFFFFF";
    const baseSecondary = isDark ? "#334155" : "#F1F5F9";
    const baseHover = isDark ? "#273449" : "#F8FAFC";

    // Dynamic tinted backgrounds
    const background = mixColors(
        baseBackground,
        accent,
        isDark ? 0.12 : 0.045
    );

    const surface = mixColors(
        baseSurface,
        accent,
        isDark ? 0.08 : 0.025
    );

    const surfaceSecondary = mixColors(
        baseSecondary,
        accent,
        isDark ? 0.10 : 0.07
    );

    const surfaceHover = mixColors(
        baseHover,
        accent,
        isDark ? 0.14 : 0.09
    );

    // Dynamic primary light
    const primaryLight = mixColors(
        baseSurface,
        accent,
        isDark ? 0.25 : 0.12
    );

    // Theme colors
    const colors = {
        ...theme.colors,

        // Brand
        primary: accent,
        primaryHover: darkenColor(accent),
        primaryLight,

        // Backgrounds
        background,
        surface,
        surfaceSecondary,
        surfaceHover,

        // Text
        textPrimary: isDark ? "#F8FAFC" : "#0F172A",
        textSecondary: isDark ? "#CBD5E1" : "#475569",
        textMuted: "#94A3B8",
        textDisabled: isDark ? "#64748B" : "#CBD5E1",

        // Borders
        border: isDark ? "#334155" : "#E2E8F0",
        borderLight: isDark ? "#293548" : "#F1F5F9",
        borderFocus: accent,

        // Status
        successLight: isDark ? "#14532D" : "#DCFCE7",
        dangerLight: isDark ? "#7F1D1D" : "#FEE2E2",
        warningLight: isDark ? "#78350F" : "#FEF3C7",
        infoLight: isDark ? "#1E3A8A" : "#DBEAFE",

        // Social actions
        comment: accent,
    };

    const cssVariables = {};

    // Generate CSS variables for colors
    Object.entries(colors).forEach(([key, value]) => {
        const variableName = key.replace(
            /[A-Z]/g,
            (letter) => `-${letter.toLowerCase()}`
        );

        cssVariables[`--color-${variableName}`] = value;
    });

    // Generate CSS variables for radius
    Object.entries(theme.radius).forEach(([key, value]) => {
        cssVariables[`--radius-${key}`] = value;
    });

    // Generate CSS variables for shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
        const darkShadows = {
            sm: "0 1px 3px rgba(0,0,0,0.25)",
            md: "0 4px 12px rgba(0,0,0,0.30)",
            lg: "0 10px 30px rgba(0,0,0,0.40)",
        };

        cssVariables[`--shadow-${key}`] = isDark
            ? darkShadows[key]
            : value;
    });

    return cssVariables;
};

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return saved?.mode || defaultTheme.mode;
        } catch {
            return defaultTheme.mode;
        }
    });

    const [accent, setAccent] = useState(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return saved?.accent || defaultTheme.accent;
        } catch {
            return defaultTheme.accent;
        }
    });

    const [systemDark, setSystemDark] = useState(() => {
        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    });

    // Listen to system theme changes
    useEffect(() => {
        const media = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const handleChange = (event) => {
            setSystemDark(event.matches);
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, []);

    // Determine active theme mode
    const activeMode =
        mode === "system"
            ? systemDark
                ? "dark"
                : "light"
            : mode;

    // Apply theme globally
    // Apply theme globally
    useEffect(() => {
        const root = document.documentElement;

        const cssVariables = generateTheme(
            activeMode,
            accent
        );

        Object.entries(cssVariables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        root.setAttribute("data-theme", activeMode);
        root.style.colorScheme = activeMode;

        // ================= DYNAMIC FAVICON =================

        let favicon = document.getElementById("dynamic-favicon");

        if (!favicon) {
            favicon = document.createElement("link");
            favicon.id = "dynamic-favicon";
            favicon.rel = "icon";
            favicon.type = "image/svg+xml";
            document.head.appendChild(favicon);
        }

        const primaryColor = cssVariables["--color-primary"];
        const whiteColor = cssVariables["--color-white"];

        const faviconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect
                width="100"
                height="100"
                rx="24"
                fill="${primaryColor}"
            />
            <text
                x="50"
                y="52"
                dominant-baseline="central"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="58"
                font-weight="700"
                fill="${whiteColor}"
            >C</text>
        </svg>
    `;

        favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(faviconSvg)}`;

        // Save preferences
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                mode,
                accent,
            })
        );
    }, [mode, accent, activeMode]);

    // Reset theme
    const resetTheme = () => {
        setMode(defaultTheme.mode);
        setAccent(defaultTheme.accent);
    };

    const value = {
        mode,
        accent,
        activeMode,
        setMode,
        setAccent,
        resetTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom theme hook
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}
