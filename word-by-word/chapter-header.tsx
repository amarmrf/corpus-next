import { Chapter } from '../corpus/orthography/chapter';
import makkah from '../images/makkah.svg';
import madinah from '../images/madinah.svg';

type Props = {
    chapter: Chapter
}

export const ChapterHeader = ({ chapter }: Props) => {
    const { phonetic, translation } = chapter;

    return (
        <header className="p-6 pt-4 text-2xl">
            <div className="grid grid-cols-[1fr_auto_auto_1fr] items-center sm:grid-cols-[1fr_auto_minmax(0,1fr)]">
                <div className="text-right sm:col-start-1 sm:col-end-2 col-start-2 col-end-3">
                    <img 
                        src={chapter.city === 'Makkah' ? makkah : madinah} 
                        className="h-9 mr-4 inline"
                        alt={chapter.city}
                    />
                </div>
                <div className="text-center sm:col-start-2 sm:col-end-3 col-start-3 col-end-4">
                    Sūrat {phonetic}
                    {translation && (
                        <>
                            <span className="sm:hidden"> </span>
                            <span className="sm:block">({translation})</span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-2.5">Word by Word</div>
        </header>
    )
}