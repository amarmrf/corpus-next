import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { formatLocation } from '../corpus/orthography/location';
import { getVerseId } from './verse-id';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
    token: Token
}

export const ReaderToken = ({ token }: Props) => {
    const { location } = token;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        
        // Save current scroll position
        const scrollPosition = window.scrollY;
        
        // Create new URL with updated hash parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('hash', formatLocation(location));
        
        // Update URL without page reload
        window.history.pushState(null, '', `${pathname}?${params.toString()}`);
        
        // Create and dispatch a custom event that client.tsx will listen for
        const event = new CustomEvent('wordClicked', { 
            detail: { 
                location,
                scrollPosition 
            } 
        });
        window.dispatchEvent(event);
    }, [location, pathname, searchParams]);
    
    // Check if this token is currently selected
    const isSelected = searchParams.get('hash') === formatLocation(location);
    
    return (
        <a 
            id={location[2] === 1 ? getVerseId(location) : undefined}
            className={`cursor-pointer sm:hover:bg-[#edf3fc] ${isSelected ? 'bg-[#edf3fc]' : ''}`}
            href={`${pathname}?hash=${formatLocation(location)}`}
            onClick={handleClick}
        >
            <ArabicToken token={token} />
        </a>
    )
}