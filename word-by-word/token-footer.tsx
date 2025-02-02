import { Token } from '../corpus/orthography/token';

type Props = {
    token: Token
}

export const TokenFooter = ({ token }: Props) => {
    const { translation, phonetic } = token;
    return (
        <div className="flex flex-col items-center">
            <div className="text-[#4886d0] leading-[1.6em] ltr sm:text-base text-[90%]">{phonetic}</div>
            <div className="leading-[1.6em] ltr sm:text-base text-[90%]">{translation}</div>
        </div>
    )
}