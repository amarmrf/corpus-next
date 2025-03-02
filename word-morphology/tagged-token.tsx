import { Token } from '../corpus/orthography/token';
import { TokenHeader } from './token-header';
import { ArabicToken } from '../arabic/arabic-token';
import { PosTag } from './pos-tag';
// import './tagged-token.scss';

type Props = {
    token: Token
}

export const TaggedToken = ({ token }: Props) => {
    const { segments } = token;
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <TokenHeader token={token} />
            <div className="my-4 text-center">
                <ArabicToken token={token} />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
                {
                    (() => {
                        const posTags = [];
                        for (var i = segments.length - 1; i >= 0; i--) {
                            const segment = segments[i];
                            if (segment.posTag !== 'DET') {
                                posTags.push(
                                    <PosTag key={i} segment={segment} />
                                )
                            }
                        }
                        return posTags;
                    })()
                }
            </div>
        </div>
    )
}