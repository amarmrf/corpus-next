import Link from 'next/link'

type Props = {
    url: string
}

export const CloseButton = ({ url }: Props) => {
    return (
        <Link href={url} className='rounded-[20px] transition-colors duration-300 cursor-pointer hover:bg-[#e5e5e5]'>
            <svg
                viewBox='0 0 100 100'
                className='w-[40px] h-[40px] text-black'>
                <path
                    stroke='currentColor'
                    strokeWidth={3.5}
                    d='M 38 38 L 62 62 M 62 38 L 38 62' />
            </svg>
        </Link>
    )
}