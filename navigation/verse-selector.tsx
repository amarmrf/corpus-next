import React from 'react';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { SelectorList } from './selector-list';
import { container } from 'tsyringe';
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
        const location = (params.location as string).split(':');
        if (location.length > 1) {
            currentVerseNumber = parseInt(location[1], 10);
        }
    }

    const handleNavigation = (path: string) => {
        onNavigate(path);
        onClose();
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
                            onClick={() => handleNavigation(`${baseUrl}/${chapNum}`)}
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
                            onClick={() => handleNavigation(`${baseUrl}/${chapterNumber}:${verseNumber}`)}
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