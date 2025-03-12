import Link from 'next/link'
// import './corpus-header.scss';

type CorpusHeaderProps = {
    shouldShow?: boolean;
}

export const CorpusHeader = ({ shouldShow = true }: CorpusHeaderProps) => {
    if (!shouldShow) {
        return null;
    }
    
    return (
        <header className='m-[30px_25px] italic text-[90%]'>
            Welcome to the <Link href='/'>Quranic Arabic Corpus</Link>, an annotated linguistic
            resource which shows the Arabic grammar, syntax and morphology for each word in the
            Quran. Click on an Arabic word below to see details of the word&#39;s grammar, or to suggest
            a correction.
        </header>
    )
}