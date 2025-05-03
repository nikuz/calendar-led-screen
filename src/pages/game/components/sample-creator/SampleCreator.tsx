import { createSignal, createResource, createEffect, Show } from 'solid-js';
import { getTypingSample } from '@game/services';
import {
    retrieveStoredTypingSamples,
    // storeTypingSamples,
} from '@game/utils';
import './SampleCreator.css';

export function SampleCreator() {
    const [prompt, setPrompt] = createSignal<string | undefined>(undefined);
    const [storedTypingSamples, { mutate: mutateStoredTypingSamples }] = createResource(retrieveStoredTypingSamples, { initialValue: [] });
    const [newTypingSample, { mutate: mutateNewTypingSample }] = createResource(
        prompt,
        (promptValue) => getTypingSample({ prompt: promptValue }),
        { initialValue: '' }
    );
    let textareaElRef: HTMLTextAreaElement | undefined;
    
    const requestNewSampleHandler = () => {
        const textareaEl = textareaElRef;
        if (!textareaEl) {
            return;
        }
        setPrompt(textareaEl.value);
    };

    createEffect(() => {
        console.log('samples', storedTypingSamples());
    });
    
    // createEffect(() => {
    //     const newSample = newTypingSample();
    //     const storedSamples = storedTypingSamples();

    //     if (newSample && storedSamples) {
    //         const updatedSamples = [
    //             newSample,
    //             ...storedSamples,
    //         ];
    //         storeTypingSamples(updatedSamples);
    //         mutateNewTypingSample('');
    //         mutateStoredTypingSamples(updatedSamples);
    //     }
    // });

    return (
        <div
            class="sample-creator-container"
        >
            <Show when={newTypingSample()}>
                <input
                    type='text'
                    value={newTypingSample()}
                    class="scc-preview"
                    autofocus
                />
            </Show>
            <Show when={!newTypingSample()}>
                <div class="scc-prompt-container">
                    <textarea
                        ref={textareaElRef}
                        class="scc-prompt-field"
                        autocomplete="off"
                        spellcheck="false"
                        autofocus
                    >
                        {prompt()}
                    </textarea>

                    <button
                        class="game-btn"
                        onClick={requestNewSampleHandler}
                    >
                        Get words
                    </button>
                </div>
            </Show>
        </div>
    );
}