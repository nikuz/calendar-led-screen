import cl from 'classnames';
import { revealInvisibleCharacters } from '@game/utils';

interface Props {
    sample: string,
    index: number,
    focused: boolean,
}

export default function TypingSampleItem(props: Props) {
    return (
        <div class={cl('tsc-sample', { focused: props.focused })}>
            {revealInvisibleCharacters(props.sample)}
        </div>
    );
}