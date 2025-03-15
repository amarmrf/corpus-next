import { Fragment } from 'react';
import { Verse } from '../corpus/orthography/verse'
import { ReaderToken } from './reader-token';
import { SectionMark } from '../components/section-mark';
import { SajdahMark } from '../components/sajdah-mark';
import { EndOfVerse } from '../components/end-of-verse';

type Props = {
    verses: Verse[]
    className?: string
}

export const ReaderView = ({ verses, className }: Props) => {
    return (
        <div className={`flex flex-wrap justify-between gap-2.5 sm:gap-1.5 w-full after:content-[''] after:basis-[45%] after:sm:basis-[30%] ${className || ''}`} dir="rtl">
            {
                verses.map(verse => {
                    const { location, tokens, verseMark } = verse;
                    return (
                        <Fragment key={`verse-${location[0]}:${location[1]}}`}>
                            {verseMark === 'section' && <SectionMark />}
                            {
                                tokens.map((token) => (
                                    <ReaderToken
                                        key={`token-${token.location[0]}:${token.location[1]}:${token.location[2]}}}`}
                                        token={token} />
                                ))
                            }
                            {verseMark === 'sajdah' && <SajdahMark />}
                            <EndOfVerse verseNumber={location[1]} className="self-center" mode="reader" />
                        </Fragment>
                    )
                })
            }
        </div>
    )
}