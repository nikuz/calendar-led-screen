import { createMemo } from 'solid-js';
import cl from 'classnames';
import { useGameStateSelect } from '@game/state';
import { GAME_FONT_SIZE } from '@game/constants';
import './Game.css';

interface Props {
    character: string,
    index: number,
}

export default function GameCharacter(props: Props) {
    const { character, index } = props;
    const hitCharacters = useGameStateSelect('hitCharacters');
    const missCharacters = useGameStateSelect('missCharacters');
    
    const isSpecialCharacter = createMemo(() => (
        character === '↵' || character === '→'
    ));
    
    const isSpace = createMemo(() => character === ' ');

    const isHit = createMemo(() => hitCharacters().has(index));
    const isMiss = createMemo(() => missCharacters().has(index));

    return (
        <span
            class={cl('gc-character', {
                isSmall: isSpecialCharacter(),
                isSpace: isSpace(),
                isHit: isHit(),
                isMiss: isMiss(),
            })}
            style={{
                width: `${GAME_FONT_SIZE / 2}px`,
            }}
        >
            {character}
        </span>
    );
}