import { Token } from '../corpus/orthography/token';
import { ArabicToken } from '../arabic/arabic-token';
import { TokenFooter } from './token-footer';
import Link from 'next/link';
import { formatLocation } from '../corpus/orthography/location';

type Props = {
    token: Token
}

export const VerseToken = ({ token }: Props) => {
    const { location } = token;
    return (
        <Link 
            className="flex flex-col items-center p-2 cursor-pointer text-black hover:bg-[#edf3fc] sm:hover:bg-[#edf3fc]" 
            href={`#${formatLocation(location)}`}
        >
            <ArabicToken token={token} />
            <TokenFooter token={token} />
        </Link>
    )
}