import Link from 'next/link'
// import './corpus-header.scss';

export const CorpusHeader = () => {
    return (
        <header className='corpus-header'>
            Welcome to the <Link href='/'>Quranic Arabic Corpus</Link>, an annotated linguistic
            resource which shows the Arabic grammar, syntax and morphology for each word in the
            Quran. Click on an Arabic word below to see details of the word&#39;s grammar, or to suggest
            a correction.
        </header>
    )
}