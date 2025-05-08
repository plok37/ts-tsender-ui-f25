export function formatTokenAmount( weiAmount: number, decimal: number ): string {
    const decimalPlaces = Math.pow(10, decimal);
    const tokenAmount = weiAmount / decimalPlaces;

    return tokenAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}