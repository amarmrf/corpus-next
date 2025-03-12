'use client';

import "reflect-metadata"
import { WordByWordClient } from './client';
import { parseLocation } from '@/corpus/orthography/location';
import { CorpusError } from '@/errors/corpus-error';
import { notFound } from 'next/navigation';

type Props = {
    params: { location: string }
}

// Make this a local function, not exported
const wordByWordLoader = (params: { location: string }) => {
    console.log('WordByWordLoader - Parsing location from params:', params.location);
    
    try {
        // Check if params.location is valid
        if (!params.location) {
            console.error('Location parameter is missing');
            throw new CorpusError('404', 'Page not found');
        }
        
        // Handle the new URL format: replace hyphens with colons for parsing
        const locationParam = params.location.includes('-') 
            ? params.location.replace('-', ':') 
            : params.location;
        
        console.log('Normalized location param:', locationParam);
        
        // Parse the location (chapter or chapter:verse)
        const location = parseLocation(locationParam);
        console.log('WordByWordLoader - Parsed location array:', location);
        
        // Validate the parsed location
        if (isNaN(location[0]) || location[0] <= 0) {
            console.error('Failed to parse valid chapter number from location:', location);
            throw new CorpusError('404', 'Page not found');
        }
        
        // If only chapter provided, default to verse 1
        const result = location.length === 1 ? [location[0], 1] : location;
        console.log('WordByWordLoader - Final location:', result);
        return result;
    } catch (error) {
        console.error('Error in wordByWordLoader:', error);
        throw new CorpusError('404', 'Page not found');
    }
}

export default function WordByWordPage({ params }: Props) {
    try {
        const location = wordByWordLoader(params);
        return <WordByWordClient location={location} />;
    } catch (error) {
        console.error('Error in WordByWordPage:', error);
        if (error instanceof CorpusError && error.message === '404') {
            notFound();
        }
        throw error; // Re-throw other errors
    }
}