import "reflect-metadata";
import { Chapter } from '../corpus/orthography/chapter';
import Image from 'next/image';

type Props = {
    chapter: Chapter
}

export const ChapterHeader = ({ chapter }: Props) => {
    const { phonetic, translation } = chapter;
    const cityImageSrc = chapter.city === 'Makkah' 
        ? '/images/icons/makkah.svg' 
        : '/images/icons/madinah.svg';

    return (
        <header className="p-6 pt-4 text-2xl">
            <div className="flex flex-col items-center">
                <div className="mb-4">
                    <Image 
                        src={cityImageSrc}
                        alt={chapter.city}
                        width={48}
                        height={48}
                    />
                </div>
                <div className="text-center">
                    Sūrat {phonetic}
                    {translation && (
                        <>
                            <span className="sm:hidden"> </span>
                            <span className="sm:block">({translation})</span>
                        </>
                    )}
                </div>
                <div className="mt-2.5 text-center">Word by Word</div>
            </div>
        </header>
    )
}