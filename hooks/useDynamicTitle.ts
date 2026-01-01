"use client";

import { useEffect } from "react";

export function useDynamicTitle(fullName?: string) {
    useEffect(() => {
        const name = (fullName || "").trim();
        document.title = name ? `Portfolio Builder - ${name}` : "Portfolio Builder";
    }, [fullName]);
}
