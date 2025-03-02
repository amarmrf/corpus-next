import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { TokenFooter } from './token-footer';
import Link from 'next/link';
import { formatLocation } from '../corpus/orthography/location';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
    token: Token
}

export const VerseToken = ({ token }: Props) => {
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
            className={`flex flex-col items-center p-2 cursor-pointer text-black rounded-md ${
                isSelected ? 'bg-[#edf3fc]' : 'hover:bg-[#edf3fc]'
            }`}
            href={`${pathname}?hash=${formatLocation(location)}`}
            onClick={handleClick}
            style={{ padding: '0.75rem', paddingTop: '1rem' }}
        >
            <ArabicToken token={token} />
            <TokenFooter token={token} />
        </a>
    )
}