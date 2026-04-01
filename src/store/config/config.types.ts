import type { TypeBaseColor } from "@/src/libs/constants/colors.constants";

export interface ConfigStore {
    theme: TypeBaseColor,
    setTheme: (theme: TypeBaseColor) => void
}