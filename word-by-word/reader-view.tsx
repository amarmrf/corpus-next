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
        <div className={`rtl flex flex-wrap justify-between gap-2.5 sm:gap-1.5 after:content-[''] after:flex-grow-[999999] ${className || ''}`}>
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
                            <EndOfVerse verseNumber={location[1]} />
                        </Fragment>
                    )
                })
            }
        </div>
    )
}