import { ArrowButton } from '../components/arrow-button';

type Props = {
    prevUrl?: string,
    nextUrl?: string
}

export const PrevNextNavigation = ({ prevUrl, nextUrl }: Props) => {
    return (
        <div className="flex gap-2">
            <ArrowButton url={prevUrl} />
            <ArrowButton right={true} url={nextUrl} />
        </div>
    )
}