export type Location = number[];

export const parseLocation = (location: string): Location => location.split(':').map(Number)

export const parseHashLocation = (hash: string): Location | undefined => {
    // Remove the hash symbol if it exists
    const locationString = hash.startsWith('#') ? hash.substring(1) : hash;
    const [a, b, c] = parseLocation(locationString);
    return [a, b, c].every(val => !isNaN(val)) ? [a, b, c] : undefined;
}

export const formatLocation = (location: Location) => location.join(':')
export const formatLocationWithBrackets = (location: Location) => `(${formatLocation(location)})`