import { Token } from '../corpus/orthography/token';
import { formatLocation } from '../corpus/orthography/location';
// import './token-header.scss';

type Props = {
    token: Token
}

export const TokenHeader = ({ token }: Props) => {
    const { location, translation, phonetic } = token;
    return (
        <div className="text-center mb-3">
            <div className="text-gray-500 text-sm">{formatLocation(location)}</div>
            <div className="text-lg font-medium text-blue-600 my-1">{phonetic}</div>
            <div className="text-gray-700">{translation}</div>
        </div>
    )
}