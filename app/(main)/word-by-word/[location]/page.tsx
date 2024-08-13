import { WordByWordClient } from './client';
import { parseLocation } from '@/corpus/orthography/location';
import { CorpusError } from '@/errors/corpus-error';

type Props = {
    params: { location: string }
}

export const wordByWordLoader = (params: { location: string }) => {
    const location = parseLocation(params.location);
    if (isNaN(location[0])) {
        throw new CorpusError('404', 'Page not found');
    }
    return location.length === 1 ? [location[0], 1] : location;
}

export default function WordByWordPage({ params }: Props) {
    const location = wordByWordLoader(params);
    return <WordByWordClient location={location} />;
}