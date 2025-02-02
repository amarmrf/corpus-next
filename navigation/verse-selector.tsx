import React from 'react';
import { ChapterService } from '../corpus/orthography/chapter-service';
import { SelectorList } from './selector-list';
import { container } from 'tsyringe';

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

    const handleNavigation = (path: string) => {
        onNavigate(path);
        onClose();
    };

    return (
        <div className="absolute h-[--popup-menu-height] text-white bg-black left-1/2 -translate-x-1/2 flex p-1">
            <SelectorList
                header='Chapter'
                length={chapters.length}
                renderItem={(i) => {
                    const { chapterNumber, phonetic } = chapters[i];
                    return (
                        <button
                            key={chapterNumber}
                            onClick={() => handleNavigation(`${baseUrl}/${chapterNumber}`)}
                            className="block py-2 px-2 pr-6 whitespace-nowrap text-white hover:bg-gray-700"
                        >
                            {chapterNumber}. {phonetic}
                        </button>
                    );
                }}
            />
            <SelectorList
                header='Verse'
                length={verseCount}
                renderItem={(i) => {
                    const verseNumber = i + 1;
                    return (
                        <button
                            key={verseNumber}
                            onClick={() => handleNavigation(`${baseUrl}/${chapterNumber}:${verseNumber}`)}
                            className="block py-2 px-2 pr-6 whitespace-nowrap text-white hover:bg-gray-700"
                        >
                            {verseNumber}
                        </button>
                    );
                }}
            />
        </div>
    );
};