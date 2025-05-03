import { routerUtils } from 'src/utils';

interface Props {
    prompt?: string,
}

export async function getTypingSample(props: Props): Promise<string> {
    if (props.prompt === undefined) {
        return '';
    }

    const response = await fetch(routerUtils.withApiUrl(`/game/typing-sample?prompt=${props.prompt}`));

    if (!response.ok) {
        throw response.status;
    }

    return await response.text();
}