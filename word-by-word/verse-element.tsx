import { IconButton } from '../components/icon-button';
import { Verse } from '../corpus/orthography/verse';
import { VerseToken } from './verse-token';
import { SectionMark } from '../components/section-mark';
import { SajdahMark } from '../components/sajdah-mark';
import { EndOfVerse } from '../components/end-of-verse';
import { ClipboardService } from '../clipboard/clipboard-service';
import { getVerseId } from './verse-id';
import { container } from 'tsyringe';
import copy from '../images/icons/copy.svg';

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
        <div id={getVerseId(location)} className="pt-4 pb-5 pl-5 pr-4">
            <div className="flex">
                <span className="text-gray-500">{location[0]}:{location[1]}</span>
                <IconButton className="w-4 ml-2.5" icon={copy} onClick={handleCopy} />
            </div>
            <div className="rtl flex flex-wrap gap-y-5 flex-1 mt-1.5">
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
    )
}