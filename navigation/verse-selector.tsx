import React from 'react';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { SelectorList } from './selector-list';
import { container } from '../lib/tsyringe-setup';
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';

type Props = {
    chapterNumber: number,
    onClose: () => void,
    onNavigate: (path: string) => void,
    baseUrl: string
}

export const VerseSelector: React.FC<Props> = ({ chapterNumber, onClose, onNavigate, baseUrl }) => {
    const chapterService = container.resolve(ChapterService);
    const chapters = chapterService.chapters;
    const verseCount = chapterService.getChapter(chapterNumber).verseCount;
    const params = useParams();
    
    // Extract current verse number from URL if available
    let currentVerseNumber = 0;
    if (params && params.location) {
        // Handle both hyphen and colon formats in the URL
        const location = params.location as string;
        const parts = location.includes('-')
            ? location.split('-')
            : location.split(':');
            
        if (parts.length > 1) {
            currentVerseNumber = parseInt(parts[1], 10);
        }
    }

    const handleNavigation = (path: string) => {
        console.log('VerseSelector navigating to:', path);
        onNavigate(path);
        onClose();
    };

    const handleChapterClick = (chapNum: number) => {
        // For chapter only navigation
        const path = `${baseUrl}/${chapNum}`;
        console.log('Chapter selected:', chapNum, 'Path:', path);
        handleNavigation(path);
    };

    const handleVerseClick = (verseNumber: number) => {
        // Create a path with the chapter:verse format
        // Make sure both chapter and verse are valid numbers
        if (chapterNumber > 0 && verseNumber > 0) {
            // Use the colon format in the path - the navigation handler will encode it if needed
            const path = `${baseUrl}/${chapterNumber}:${verseNumber}`;
            console.log('Verse selected:', verseNumber, 'Path:', path);
            handleNavigation(path);
        } else {
            console.error('Invalid chapter or verse number:', chapterNumber, verseNumber);
        }
    };

    return (
        <div className="w-auto max-h-[80vh] overflow-auto text-white bg-black flex p-4">
            <SelectorList
                header='Chapter'
                length={chapters.length}
                renderItem={(i) => {
                    const { chapterNumber: chapNum, phonetic } = chapters[i];
                    const isSelected = chapNum === chapterNumber;
                    return (
                        <button
                            key={chapNum}
                            onClick={() => handleChapterClick(chapNum)}
                            className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded"
                        >
                            <span>{chapNum}. {phonetic}</span>
                            {isSelected && <Check size={20} />}
                        </button>
                    );
                }}
            />
            <SelectorList
                header='Verse'
                length={verseCount}
                renderItem={(i) => {
                    const verseNumber = i + 1;
                    const isSelected = verseNumber === currentVerseNumber;
                    return (
                        <button
                            key={verseNumber}
                            onClick={() => handleVerseClick(verseNumber)}
                            className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded"
                        >
                            <span>{verseNumber}</span>
                            {isSelected && <Check size={20} />}
                        </button>
                    );
                }}
            />
        </div>
    );
};