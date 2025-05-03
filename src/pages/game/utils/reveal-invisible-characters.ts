export function revealInvisibleCharacters(text: string) {
    return text
        .replace(/\t/g, '→')
        .replace(/\n/g, '↵');
}