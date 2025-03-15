import { useMemo } from 'react';
import { Token } from '../corpus/orthography/token';
import { ArabicTextService } from '../arabic/arabic-text-service';
import { ColorService } from '../theme/color-service';
import { container } from 'tsyringe';

type Props = {
    token: Token,
    fade?: boolean
}

export const ArabicToken = ({ token, fade }: Props) => {
    const arabicTextService = container.resolve(ArabicTextService);
    const colorService = container.resolve(ColorService);

    const { segments } = token;

    const joinedSegments = useMemo(() => {
        const joinedSegments = segments.map(segment => segment.arabic);
        arabicTextService.insertZeroWidthJoinersForSafari(joinedSegments);
        return joinedSegments;
    }, [segments]);

    return (
        <div className="font-arabic text-4xl sm:text-3xl leading-[1.8] whitespace-nowrap">
            {
                segments.map((segment, i) => {
                    const joinedSegment = joinedSegments[i];
                    return joinedSegment
                        ? (
                            <span
                                key={`segment-${i}`}
                                className={`${fade ? 'text-silver' : colorService.getSegmentColor(segment)}`}
                                dangerouslySetInnerHTML={{ __html: joinedSegment }} />
                        )
                        : null;
                })
            }
        </div>
    )
}