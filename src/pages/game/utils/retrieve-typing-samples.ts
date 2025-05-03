import { GAME_TYPING_SAMPLE_STORAGE_NAME } from '@game/constants';

export function retrieveStoredTypingSamples(): string[] {
    const storedSamples = localStorage.getItem(GAME_TYPING_SAMPLE_STORAGE_NAME);
    let samples: string[] = [];

    if (storedSamples !== null) {
        try {
            samples = JSON.parse(storedSamples);
        } catch {
            //
        }
    }

    return samples;
}