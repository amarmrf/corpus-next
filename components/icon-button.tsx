import { combineClassNames } from '../theme/class-names';

type Props = {
    className?: string,
    icon: string,
    onClick: () => void
}

export const IconButton = ({ className, icon, onClick }: Props) => (
    <img
        className={combineClassNames('cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-80 active:scale-95', className)}
        src={icon}
        onClick={onClick} />
)