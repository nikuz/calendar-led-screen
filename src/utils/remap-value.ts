export function remapValue(props: {
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
}): number {
    if (props.value < props.inMin) {
        return props.outMin;
    }
    if (props.value > props.inMax) {
        return props.outMax;
    }

    return (
        ((props.value - props.inMin) * (props.outMax - props.outMin)) / (props.inMax - props.inMin)
    ) + props.outMin;
};