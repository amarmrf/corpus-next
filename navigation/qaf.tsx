import Image from 'next/image';
import qaf from '@/images/qaf-white.svg';

export const Qaf = () => {
    return (
        <div className="flex items-center justify-center h-full px-4">
            <div className="h-5 w-5">
                <Image src="/images/qaf-white.svg" alt="Qaf logo" width={20} height={20} />
            </div>
        </div>
    )
}