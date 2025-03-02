import "reflect-metadata";
import { WordMorphology } from '../corpus/morphology/word-morphology';
import { TaggedToken } from './tagged-token';
import { CloseButton } from '../components/close-button';
import { MarkupView } from '../components/markup-view';
import { NodeCircle } from './node-circle';
import { usePathname } from 'next/navigation';
import { ColorService } from '../theme/color-service';
import { container } from '@/lib/tsyringe-setup';

type Props = {
    wordMorphology: WordMorphology
}

export const WordMorphologyView = ({ wordMorphology }: Props) => {
    const pathname = usePathname();
    const { token, summary, segmentDescriptions, arabicGrammar } = wordMorphology;
    const { segments } = token;
    const colorService = container.resolve(ColorService);

    return (
        <div className="fixed right-0 top-[var(--app-header-height)] bottom-0 w-[350px] bg-white shadow-lg overflow-y-auto z-10 border-l border-gray-200">
            <header className="bg-white text-gray-800 p-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-200">
                <h1 className="text-xl font-semibold">Quranic Grammar</h1>
                <CloseButton url={pathname} />
            </header>
            <div className="p-4">
                <TaggedToken token={token} />
                <section className="mt-4">
                    <div className="mb-4 text-gray-700">
                        <MarkupView markup={summary} />
                    </div>
                    <div className="space-y-3">
                        {
                            (() => {
                                const descriptions = [];
                                let i = 0;
                                for (const segment of segments) {
                                    if (segment.posTag !== 'DET') {
                                        const className = colorService.getSegmentColor(segment);
                                        descriptions.push(
                                            <div key={`description-${i}`} className="flex items-start space-x-2">
                                                <NodeCircle className={className} />
                                                <div className="flex-1">
                                                    <strong className={className}>{segment.posTag}</strong> &ndash; <MarkupView markup={segmentDescriptions[i++]} />
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                                return descriptions;
                            })()
                        }
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded rtl">
                        {
                            arabicGrammar.split('\n').map((line, i) => (
                                <div key={`grammar-${i}`} className="my-1 text-right leading-relaxed">{line}</div>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    )
}