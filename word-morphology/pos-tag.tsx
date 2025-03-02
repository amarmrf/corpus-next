import { Segment } from '../corpus/morphology/segment';
import { ColorService } from '../theme/color-service';
import { NodeCircle } from './node-circle';
import { container } from 'tsyringe';
// import './pos-tag.scss';

type Props = {
    segment: Segment
}

export const PosTag = ({ segment }: Props) => {
    const colorService = container.resolve(ColorService);
    const className = colorService.getSegmentColor(segment);
    return (
        <div className="flex flex-col items-center">
            <NodeCircle className={className} />
            <div className={`${className} text-sm font-medium mt-1`}>{segment.posTag}</div>
        </div>
    )
}