import { useMemo } from 'react';
import { MarkupParser } from '../corpus/nlg/markup-parser';

type Props = {
    markup: string
}

export const MarkupView = ({ markup }: Props) => {
    const spans = useMemo(() => {
        const markupParser = new MarkupParser(markup);
        return markupParser.parse();
    }, [markup]);

    return (
        <>
            {
                spans.map((span, index) => {
                    switch (span.type) {
                        case 'phonetic':
                            return <em key={`phonetic-${index}`} className='text-[#4886d0] italic'>{span.text}</em>;
                        case 'arabic':
                            return (
                                <span key={`arabic-${index}`}>
                                    {'('}
                                    <span className='text-[#4886d0]'>{span.text}</span>
                                    {')'}
                                </span>
                            );
                        default:
                            return <span key={`default-${index}`}>{span.text}</span>;
                    }
                })
            }
        </>
    );
}