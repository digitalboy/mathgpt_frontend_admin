// src/utils/escapeRegExp.ts

/**
 * Escapes a string for use in a regular expression.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}