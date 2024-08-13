'use client';

import "reflect-metadata"
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChapterService } from '@/corpus/orthography/chapter-service';
import { MorphologyService } from '@/corpus/morphology/morphology-service';
import { WordMorphology } from '@/corpus/morphology/word-morphology';
import { Verse } from '@/corpus/orthography/verse';
import { Location, parseHashLocation } from '@/corpus/orthography/location';
import { ReaderView } from '@/word-by-word/reader-view';
import { DetailView } from '@/word-by-word/detail-view';
import { useSettings } from '@/settings/settings-context';
import { ChapterHeader } from '@/word-by-word/chapter-header';
import { CorpusHeader } from '@/components/corpus-header';
import { LoadingBanner } from '@/components/loading-banner';
// import { WordMorphologyView } from '@/word-morphology/word-morphology-view';
import { getVerseId } from '@/word-by-word/verse-id';
import { useProgress } from '@/app/progress-context';
import { container } from 'tsyringe';
import './styles.scss';

type Props = {
    location: Location;
}

type ScrollTarget = {
    verseNumber: number
}

const buildMorphologyQuery = (up: boolean, urlVerseNumber: number, verses: Verse[]) => {
    let verseCount = 10;
    let start: number;
    if (verses.length === 0) {
        start = urlVerseNumber;
    } else if (up) {
        const first = verses[0].location[1];
        start = Math.max(1, first - verseCount);
        if (start < first) {
            verseCount = first - start;
        }
    } else {
        start = verses[verses.length - 1].location[1] + 1;
    }
    return { start, verseCount };
}

const intersectionOptions = {
    rootMargin: '0px',
    threshold: 0.1
}

export function WordByWordClient({ location }: Props) {
    const searchParams = useSearchParams();
    const [chapterNumber, verseNumber] = location;
    const { showProgress } = useProgress();

    // Services
    const chapterService = container.resolve(ChapterService);
    const morphologyService = container.resolve(MorphologyService);
    const chapter = chapterService.getChapter(chapterNumber);

    // State
    const [verses, setVerses] = useState<Verse[]>([]);
    const [scrollTarget, setScrollTarget] = useState<ScrollTarget>();
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [startComplete, setStartComplete] = useState(false);
    const [endComplete, setEndComplete] = useState(false);
    const { settings } = useSettings();
    const { readerMode, translations } = settings;
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [wordMorphology, setWordMorphology] = useState<WordMorphology>();

    // Refs
    const loadingRefTop = useRef<HTMLDivElement>(null);
    const loadingRefBottom = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef<boolean>(false);

    const loadVerses = async (up: boolean, verses: Verse[]) => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        console.log(`Loading verses: direction = ${up ? 'up' : 'down'}`);
        if (up) {
            setLoadingTop(true);
        } else {
            setLoadingBottom(true);
        }
        console.log(`    loading verse number ${verseNumber}`);
        const { start, verseCount } = buildMorphologyQuery(up, verseNumber, verses);
        console.log(`    loading verse ${chapterNumber}:${start} (n = ${verseCount})`);
        const loadedVerses = await morphologyService.getMorphology([chapterNumber, start], verseCount, translations);
        const newVerses = up ? [...loadedVerses, ...verses] : [...verses, ...loadedVerses];
        setVerses(newVerses);
        setScrollTarget(
            up
                ? verses.length > 0 ? { verseNumber: verses[0].location[1] - 1 } : undefined
                : undefined
        );

        if (newVerses[0].location[1] === 1) {
            if (!startComplete) console.log('    start complete');
            setStartComplete(true);
        }

        if (newVerses[newVerses.length - 1].location[1] === chapter.verseCount) {
            if (!endComplete) console.log('    end complete');
            setEndComplete(true);
        }

        isLoadingRef.current = false;
        if (up) {
            setLoadingTop(false);
        } else {
            setLoadingBottom(false);
        }
        console.log('    done');
    };

    useEffect(() => {
        setVerses([]);
        setStartComplete(false);
        setEndComplete(false);
        loadVerses(false, []);
    }, [chapterNumber, verseNumber, translations]);

    useEffect(() => {
        if (!scrollTarget) return;
        const { verseNumber } = scrollTarget;
        let targetElement = verseNumber === 1
            ? loadingRefTop.current
            : document.querySelector(`#${getVerseId([chapterNumber, verseNumber])}`);
        if (targetElement) {
            console.log(`Scrolling to verse ${verseNumber}`)
            targetElement.scrollIntoView();

            const bodyTop = document.body.getBoundingClientRect().top;
            const elementTop = targetElement.getBoundingClientRect().top;
            window.scrollTo({
                top: elementTop - bodyTop - 50,
                behavior: 'smooth'
            });
        }
    }, [verses, scrollTarget]);

    useEffect(() => {
        const observerTop = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !startComplete && isScrollingUp) {
                loadVerses(true, verses);
            }
        }, intersectionOptions);

        const observerBottom = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoadingRef.current && !endComplete) {
                loadVerses(false, verses);
            }
        }, intersectionOptions);

        if (loadingRefTop.current) {
            observerTop.observe(loadingRefTop.current);
        }

        if (loadingRefBottom.current) {
            observerBottom.observe(loadingRefBottom.current);
        }

        return () => {
            if (loadingRefTop.current) {
                observerTop.unobserve(loadingRefTop.current);
            }
            if (loadingRefBottom.current) {
                observerBottom.unobserve(loadingRefBottom.current);
            }
        };
    }, [verses, loadingTop, loadingBottom, startComplete, endComplete, isScrollingUp]);

    useEffect(() => {
        const handleWheelScroll = (event: WheelEvent) => {
            setIsScrollingUp(event.deltaY < 0);
        };

        const handleTouchScroll = (event: TouchEvent) => {
            setIsScrollingUp(event.touches[0].clientY > event.touches[event.touches.length - 1].clientY);
        };

        window.addEventListener('wheel', handleWheelScroll);
        window.addEventListener('touchmove', handleTouchScroll);

        return () => {
            window.removeEventListener('wheel', handleWheelScroll);
            window.removeEventListener('touchmove', handleTouchScroll);
        };
    }, []);

    useEffect(() => {
        const hash = searchParams.get('hash');
        if (!hash) {
            setWordMorphology(undefined);
            return;
        }

        (async () => {
            showProgress(true);
            const hashLocation = parseHashLocation(hash);
            if (hashLocation) {
                setWordMorphology(await morphologyService.getWordMorphology(hashLocation));
            }
            showProgress(false);
        })();
    }, [searchParams]);

    // Navigation object
    const navigation = { chapterNumber };

    return (
        <div className='word-by-word'>
            <CorpusHeader />
            {loadingTop && <LoadingBanner />}
            <div ref={loadingRefTop} />
            {
                verses.length > 0 && verses[0].location[1] === 1 &&
                <ChapterHeader chapter={chapter} />
            }
            {
                readerMode
                    ? <ReaderView verses={verses} />
                    : <DetailView verses={verses} />
            }
            {loadingBottom && <LoadingBanner />}
            <div ref={loadingRefBottom} />
            {/* {wordMorphology && <WordMorphologyView wordMorphology={wordMorphology} />} */}
        </div>
    );
}