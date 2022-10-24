export function BASE_PATH(): string {
    return "/";
}

/**
 * Enum that represents possible pages in the QuickTick application.
 */
export enum QuickTickPage {
    HOME = "/",
    DAILY = "/daily",
    UPCOMING = "/upcoming",
    TIMECHARGING = "/timecharging",
    STATS = "/stats",
    NOT_FOUND = "/404",
}