export function ReLU(num: number): number {
    const num_int = parseInt(num.toString());
    const num_decimal = num - num_int;

    const count = num_decimal > 0.5 ? 1 : 0;
    return num_int + count;
}