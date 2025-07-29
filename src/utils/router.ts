export function withApiUrl(endpoint: string): string {
    const apiUrl = import.meta.env?.PUBLIC_API_URL ?? window.location.origin;
    let resultEndpoint = endpoint;

    if (apiUrl.endsWith('/') && resultEndpoint.startsWith('/')) {
        resultEndpoint = resultEndpoint.replace('/', '');
    }

    return `${apiUrl}${resultEndpoint}`;
}