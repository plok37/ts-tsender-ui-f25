export function calculateTotal(amounts: string): number {

    const amountArray = amounts.split(/[\n,]+/) // split the string on both commas and newlines (more than one)
        // Example: "1,2\n3,,4\n\n5".split(/[\n,]+/) would return ["1", "2", "3", "4", "5"]

        .map(amt => amt.trim()) // remove whitespace around each string
        // Example: [" 1 ", " 2 ", " 3 "].map(amt => amt.trim()) becomes ["1", "2", "3"]
        
        .filter(amt => amt !== "") // remove empty strings
        // Example: ["1", "", "2"].filter(amt => amt !== "") becomes ["1", "2"]

        .map(amt => parseFloat(amt)) // convert to numbers;
        // Example: ["1", "2.5", "3"].map(amt => parseFloat(amt)) becomes [1, 2.5, 3]

    // Sum all valid numbers (filter out NaN values)
    return amountArray
        .filter(num => !isNaN(num))
        // Example: [1, NaN, 2].filter(num => !isNaN(num)) becomes [1, 2]
        .reduce((sum, num) => sum + num, 0);
        // .reduce(): This method combines all elements in the array into a single value by repeatedly applying a function.
        
}