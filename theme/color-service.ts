import { Segment } from '../corpus/morphology/segment';
import { singleton } from 'tsyringe';
import { PosTag } from '../corpus/morphology/pos-tag';
import { PhraseTag } from '../corpus/syntax/phrase-tag';
import { DependencyTag } from '../corpus/syntax/dependency-tag';

@singleton()
export class ColorService {

    private posTagColors: Map<PosTag, string> = new Map([
        ['ADJ', 'text-purple-custom'],
        ['CIRC', 'text-navy'],
        ['COM', 'text-navy'],
        ['COND', 'text-orange-custom'],
        ['CONJ', 'text-navy'],
        ['DEM', 'text-brown'],
        ['DET', 'text-gray-custom'],
        ['INL', 'text-orange-custom'],
        ['INTG', 'text-rose'],
        ['LOC', 'text-orange-custom'],
        ['N', 'text-sky'],
        ['NEG', 'text-red-custom'],
        ['PN', 'text-blue-custom'],
        ['P', 'text-rust'],
        ['PREV', 'text-orange-custom'],
        ['PRP', 'text-gold'],
        ['PRO', 'text-red-custom'],
        ['REL', 'text-gold'],
        ['REM', 'text-navy'],
        ['RSLT', 'text-navy'],
        ['SUB', 'text-gold'],
        ['T', 'text-orange-custom'],
        ['V', 'text-seagreen'],
        ['VOC', 'text-green-custom']
    ]);

    private phraseTagColors: Map<PhraseTag, string> = new Map([
        ['CS', 'text-orange-custom'],
        ['PP', 'text-rust'],
        ['SC', 'text-gold'],
        ['VS', 'text-seagreen']
    ]);

    private dependencyTagColors: Map<DependencyTag, string> = new Map([
        ['adj', 'text-purple-custom'],
        ['app', 'text-sky'],
        ['circ', 'text-seagreen'],
        ['cog', 'text-seagreen'],
        ['com', 'text-metal'],
        ['cond', 'text-orange-custom'],
        ['cpnd', 'text-sky'],
        ['gen', 'text-rust'],
        ['int', 'text-orange-custom'],
        ['intg', 'text-rose'],
        ['link', 'text-orange-custom'],
        ['neg', 'text-red-custom'],
        ['obj', 'text-metal'],
        ['pass', 'text-sky'],
        ['poss', 'text-sky'],
        ['pred', 'text-metal'],
        ['predx', 'text-metal'],
        ['prev', 'text-orange-custom'],
        ['pro', 'text-red-custom'],
        ['prp', 'text-metal'],
        ['spec', 'text-metal'],
        ['spec', 'text-sky'],
        ['sub', 'text-gold'],
        ['subj', 'text-sky'],
        ['subjx', 'text-sky'],
        ['voc', 'text-green-custom']
    ]);

    getSegmentColor(segment: Segment): string {
        const { posTag } = segment;
        const color = this.posTagColors.get(posTag);
        if (color) {
            return color;
        }
        if (posTag === 'PRON') {
            switch (segment.pronounType) {
                case 'subj':
                    return 'text-sky';
                case 'obj2':
                    return 'text-orange-custom';
                default:
                    return 'text-metal';
            }
        }
        return 'text-pink-custom';
    }

    getPhraseColor(phraseTag: PhraseTag): string {
        return this.phraseTagColors.get(phraseTag) || 'text-blue-custom';
    }

    getDependencyColor(dependencyTag: DependencyTag): string {
        return this.dependencyTagColors.get(dependencyTag) || 'text-pink-custom';
    }
}