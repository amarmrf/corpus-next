import { combineClassNames } from '../theme/class-names';
import Image from 'next/image';

type Props = {
    className?: string,
    icon: string, // Use string type for both paths and imported SVGs
    onClick: () => void
}

export const IconButton = ({ className, icon, onClick }: Props) => (
    <Image
        className={combineClassNames('cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-80 active:scale-95', className)}
        src={icon}
        alt="Icon"
        width={16}
        height={16}
        onClick={onClick} />
)