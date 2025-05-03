import {
    GAME_TYPING_SAMPLE_STORAGE_NAME,
    GAME_TYPING_SAMPLE_MAX_AMOUNT,
} from '@game/constants';

export function storeTypingSamples(samples: string[]) {
    const slicedSamples = samples.slice(0, GAME_TYPING_SAMPLE_MAX_AMOUNT);

    localStorage.setItem(GAME_TYPING_SAMPLE_STORAGE_NAME, JSON.stringify(slicedSamples));
}