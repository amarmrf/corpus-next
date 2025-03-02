import React from 'react';
import { Verse } from '../corpus/orthography/verse'
import { VerseElement } from './verse-element';

type Props = {
    verses: Verse[]
    className?: string
}

export const DetailView: React.FC<Props> = ({ verses, className }) => (
    <div className={`${className} w-full`}>
        {
            verses.map((verse, i) => (
                <VerseElement
                    key={`verse-${i}`}
                    verse={verse} />
            ))
        }
    </div>
)