import { combineClassNames } from '../theme/class-names';
// Remove SCSS import

type Props = {
    className: string
}

export const NodeCircle = ({ className }: Props) => {
    return (<div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${className}`} />)
}