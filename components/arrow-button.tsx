import Link from 'next/link'
import { combineClassNames } from '../theme/class-names';

type ArrowProps = {
    right?: boolean
}

export const Arrow = ({ right }: ArrowProps) => {
    return (
        <svg viewBox='0 0 100 100' className="w-[50px] h-[50px]">
            <path
                fill='currentColor'
                d='M55.18,32.24l2.56,2.54L42.65,50,57.74,65.22l-2.56,2.54L37.59,50Z'
                transform={right ? 'translate(100, 100) rotate(180)' : undefined} />
        </svg>
    )
}

type Props = {
    right?: boolean,
    url?: string
}

export const ArrowButton = ({ right, url }: Props) => {
    const className = combineClassNames(
        'rounded-full transition-colors duration-300',
        url ? 'border border-[#e5e5e5] hover:border-[#a9a9a9]' : 'border border-[#f0eeee]'
    );
    
    return (
        url ?
            <Link href={url} className={className}>
                <Arrow right={right} />
            </Link>
            :
            <div className={className}>
                <Arrow right={right} />
            </div>
    )
}