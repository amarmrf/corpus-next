import { Segment } from '../corpus/morphology/segment';
import { ColorService } from '../theme/color-service';
import { NodeCircle } from './node-circle';
import { container } from 'tsyringe';

type Props = {
    segment: Segment
}

export const PosTag = ({ segment }: Props) => {
    const colorService = container.resolve(ColorService);
    const className = colorService.getSegmentColor(segment);
    return (
        <div className="flex flex-col items-center text-lg">
            <NodeCircle className={className} />
            <div className={`${className} text-sm font-medium mt-1.5`}>{segment.posTag}</div>
        </div>
    )
}