import "reflect-metadata"
import Link from 'next/link'
import Image from 'next/image'

const randomNumberInInterval = (a: number, b: number) => {
    return Math.floor(Math.random() * (b - a + 1)) + a
}

const randomWordByWordLink = () => {
  const chapterNumber = randomNumberInInterval(1, 114)
  return `/word-by-word/${chapterNumber}`
}

const randomTreebankLink = () => {
    const [a, b] = Math.random() < 0.5 ? [1, 8] : [59, 114]
    const chapterNumber = randomNumberInInterval(a, b)
    // You'll need to implement this service in Next.js
    // const chapterService = container.resolve(ChapterService)
    // const verseNumber = randomNumberInInterval(1, chapterService.chapters[chapterNumber - 1].verseCount)
    const verseNumber = 1 // Placeholder, you may want to implement a more sophisticated method later
    return `/treebank/${chapterNumber}:${verseNumber}`
}


export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-50">
            <h1 className="text-4xl font-bold mb-6 text-center">The Quranic Arabic Corpus</h1>
            <p className="text-center max-w-2xl mb-4">
                The world&#39;s most popular site for learning Quranic Arabic.
                An Artificial Intelligence (AI) analyzed the entire Quran, <strong>reviewed and corrected by scholars</strong>, to provide
                deep insights into the Quran&#39;s <strong>morphology</strong>, <strong>syntax</strong>,
                and <strong>semantics</strong>.
            </p>
            <p className="text-center max-w-2xl mb-6">
                To help learners, the corpus features unique color-coded grammar diagrams
                based on <strong><em>i&#39;rāb</em> (إعراب)</strong>, the traditional science of Arabic linguistics, in the Quranic Treebank.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Link href={randomWordByWordLink()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center">
                    Quran Word by Word
                </Link>
                <Link href={randomTreebankLink()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center">
                    Quranic Treebank
                </Link>
            </div>
            <p className="text-center max-w-2xl mb-8">
                The corpus provides a <strong>supportive community</strong> for learning Quranic Arabic.
                It is a free, open-source, Wikipedia-style project, and we encourage collaboration, discussion and
                continuous improvement.
            </p>
            <div className="flex space-x-6 mb-6">
                <a href="https://app.element.io/#/room/#dg-corpus:gitter.im" className="text-gray-600 hover:text-gray-900">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                    </svg>
                </a>
                <a href="https://github.com/kaisdukes/quranic-corpus" className="text-gray-600 hover:text-gray-900">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                </a>
            </div>
        </div>
    )
}