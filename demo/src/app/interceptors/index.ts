import { AuthInterceptor } from "./auth.interceptor";
import { ExtraInterceptor } from "./extra.interceptor";

// The order in which they appear is also important
export const INTERCEPTORS = [
    AuthInterceptor,
    ExtraInterceptor
];
