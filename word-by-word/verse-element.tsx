import "reflect-metadata";
import { IconButton } from '../components/icon-button';
import { Verse } from '../corpus/orthography/verse';
import { VerseToken } from './verse-token';
import { SectionMark } from '../components/section-mark';
import { SajdahMark } from '../components/sajdah-mark';
import { EndOfVerse } from '../components/end-of-verse';
import { ClipboardService } from '../clipboard/clipboard-service';
import { getVerseId } from './verse-id';
import { container } from '@/lib/tsyringe-setup';
import Image from 'next/image';

type Props = {
    verse: Verse
}

export const VerseElement = ({ verse }: Props) => {
    const { location, tokens, translations, verseMark } = verse;

    const handleCopy = async () => {
        const clipboardService = container.resolve(ClipboardService);
        await clipboardService.copyVerse(verse);
    }

    return (
        <div id={getVerseId(location)} className="pt-4 pb-5">
            <div className="flex flex-row">
                {/* Verse number and copy button on the left */}
                <div className="flex flex-col items-center mr-4 min-w-[40px] flex-shrink-0" style={{ marginTop: '1.5rem' }}>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 mb-2">{location[0]}:{location[1]}</span>
                        <button 
                            className="w-5 h-5 cursor-pointer flex items-center justify-center" 
                            onClick={handleCopy}
                            aria-label="Copy verse"
                        >
                            <Image 
                                src="/images/icons/copy.svg" 
                                alt="Copy verse" 
                                width={20} 
                                height={20} 
                            />
                        </button>
                    </div>
                </div>
                
                {/* Verse content */}
                <div className="flex-1">
                    <div className="flex flex-wrap gap-y-5" dir="rtl">
                        {verseMark === 'section' && <SectionMark className="py-1.5" />}
                        {
                            tokens.map((token, i) => (
                                <VerseToken key={`token-${i}`} token={token} />
                            ))
                        }
                        {verseMark === 'sajdah' && <SajdahMark className="py-1.5" />}
                        <EndOfVerse verseNumber={location[1]} className="p-1.5" />
                    </div>
                    {
                        translations &&
                        <div className="mt-7 italic text-[90%] flex flex-col gap-4">
                            {
                                translations.map((translation, index) => (
                                    <div key={`translation-${index}`}>
                                        <div>
                                            {
                                                translations.length !== 1 &&
                                                <>
                                                    <strong>{translation.name}</strong>:
                                                    {' '}
                                                </>
                                            }
                                            {translation.translation}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}