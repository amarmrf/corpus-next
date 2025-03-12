export type Location = number[];

export const parseLocation = (location: string): Location => {
    console.log('parseLocation called with:', location);
    
    // Handle edge cases like empty strings or undefined
    if (!location) {
        console.warn('Empty location provided, defaulting to [1, 1]');
        return [1, 1]; // Default to first chapter, first verse
    }
    
    // Normalize input - replace any hyphens with colons to support both formats
    const normalizedLocation = location.includes('-') 
        ? location.replace(/-/g, ':') 
        : location;
    
    console.log('Normalized location for parsing:', normalizedLocation);
    
    // Split by colon and convert to numbers
    const parts = normalizedLocation.split(':').map((part, index) => {
        const num = Number(part.trim());
        console.log(`Parsing location part ${index}:`, part, 'to number:', num);
        
        // Check if it's a valid number
        if (isNaN(num)) {
            console.warn(`Invalid number at index ${index}:`, part);
            return 0; // Convert NaN to 0 for easier detection
        }
        
        return num;
    });
    
    // Ensure at least the chapter number is present and valid
    if (parts.length === 0 || parts[0] <= 0) {
        console.warn('Invalid parsed location, defaulting to [1, 1]:', parts);
        return [1, 1]; // Default to first chapter, first verse
    }
    
    // For chapter:verse format, ensure verse number is valid
    if (parts.length > 1 && parts[1] <= 0) {
        console.warn('Invalid verse number, defaulting to verse 1:', parts);
        parts[1] = 1;
    }
    
    console.log('Final parsed location:', parts);
    return parts;
}

export const parseHashLocation = (hash: string): Location | undefined => {
    // Remove the hash symbol if it exists
    const locationString = hash.startsWith('#') ? hash.substring(1) : hash;
    const [a, b, c] = parseLocation(locationString);
    return [a, b, c].every(val => !isNaN(val)) ? [a, b, c] : undefined;
}

export const formatLocation = (location: Location) => location.join(':')
export const formatLocationWithBrackets = (location: Location) => `(${formatLocation(location)})`