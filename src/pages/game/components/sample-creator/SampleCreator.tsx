import { createSignal, createResource, createEffect, Show } from 'solid-js';
import { getTypingSample } from '@game/services';
import { gameStateActor } from '@game/state';
import { revealInvisibleCharacters } from '@game/utils';
import './SampleCreator.css';

export function SampleCreator() {
    const [promptInput, setPromptInput] = createSignal('');
    const [prompt, setPrompt] = createSignal<string | undefined>(undefined);
    const [newTypingSample, { mutate: mutateNewTypingSample }] = createResource(
        prompt,
        (promptValue) => getTypingSample({ prompt: promptValue }),
        { initialValue: '' }
    );
    let previewElRef: HTMLInputElement | undefined;
    let promptElRef: HTMLTextAreaElement | undefined;
    
    const requestNewSampleHandler = () => {
        setPrompt(promptInput());
    };

    const promptChangeHandler = (event: InputEvent) => {
        const target = event.target as HTMLTextAreaElement;
        setPromptInput(target.value);
    };
    
    const promptKeyDownHandler = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            gameStateActor.send({ type: 'CLOSE_SAMPLE_CREATOR' });
        }
    };
    
    const previewChangeHandler = (event: InputEvent) => {
        const target = event.target as HTMLInputElement;
        const cursorPosition = target.selectionStart;
        target.value = revealInvisibleCharacters(newTypingSample());
        target.setSelectionRange(cursorPosition, cursorPosition);
    };
    
    const previewKeyDownHandler = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'Enter':
                gameStateActor.send({
                    type: 'ADD_SAMPLE',
                    sample: newTypingSample(),
                });
                break;
            
            case 'Escape':
                mutateNewTypingSample('');
                promptElRef?.focus();
                break;
            
            case 'Tab':
                event.preventDefault();
                break;
        }
    };

    createEffect(() => {
        if (newTypingSample() && previewElRef) {
            previewElRef.focus();
            previewElRef.setSelectionRange(0, 0);
            previewElRef.scrollLeft = 0;
        }
    });
    
    createEffect(() => {
        if (!newTypingSample()) {
            promptElRef?.focus();
        }
    });
    
    return (
        <div class="sample-creator-container">
            <Show when={newTypingSample()}>
                <div class="scc-preview-container">
                    <input
                        ref={previewElRef}
                        type='text'
                        value={revealInvisibleCharacters(newTypingSample())}
                        class="game-input scc-preview"
                        autofocus
                        onInput={previewChangeHandler}
                        onKeyDown={previewKeyDownHandler}
                    />
                </div>
            </Show>
            <Show when={!newTypingSample()}>
                <div class="scc-prompt-container">
                    <textarea
                        ref={promptElRef}
                        class="game-input scc-prompt-field"
                        placeholder="What would you like to practice today?"
                        autocomplete="off"
                        spellcheck="false"
                        autofocus
                        onKeyDown={promptKeyDownHandler}
                        onInput={promptChangeHandler}
                    >
                        {promptInput()}
                    </textarea>

                    <button
                        class="game-btn"
                        disabled={promptInput().trim() === '' || newTypingSample.loading}
                        onClick={requestNewSampleHandler}
                    >
                        Get sample
                        {newTypingSample.loading && '...'}
                    </button>
                </div>
            </Show>
        </div>
    );
}