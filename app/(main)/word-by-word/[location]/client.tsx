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
import { WordMorphologyView } from '@/word-morphology/word-morphology-view';
import { getVerseId } from '@/word-by-word/verse-id';
import { useProgress } from '@/app/progress-context';
import { container } from '@/lib/tsyringe-setup';
import "@/app/globals.css"; 

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
    console.log('Loaded with location:', chapterNumber, verseNumber); // Debug log
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
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const currentScrollRef = useRef<number>(0);
    
    // Only show welcome text for the first verse
    const shouldShowWelcomeText = verseNumber === 1;
    console.log('Should show welcome text?', shouldShowWelcomeText);

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

        // Check if we've loaded verse 1, but don't automatically show header
        // unless the actual URL parameter is for verse 1
        if (newVerses.length > 0 && newVerses[0].location[1] === 1) {
            // Don't change header visibility here - rely on the URL verse number
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        
        // Update the current scroll position ref on every render
        currentScrollRef.current = window.scrollY;
        
        if (!hash) {
            // Panel is being closed - restore the position from ref
            if (wordMorphology) {
                // Allow the component to re-render without the panel
                setTimeout(() => {
                    // Use the stored position directly from the ref
                    window.scrollTo(0, currentScrollRef.current);
                }, 10);
            }
            
            setWordMorphology(undefined);
            return;
        }

        (async () => {
            // Capture exact position when opening panel
            const capturedPosition = window.scrollY;
            currentScrollRef.current = capturedPosition;
            
            showProgress(true);
            const hashLocation = parseHashLocation(hash);
            if (hashLocation) {
                setWordMorphology(await morphologyService.getWordMorphology(hashLocation));
            }
            showProgress(false);
            
            // Restore position after panel opens
            setTimeout(() => {
                window.scrollTo(0, capturedPosition);
            }, 10);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Update the custom event handler for word clicks
    useEffect(() => {
        const handleWordClicked = async (event: Event) => {
            const customEvent = event as CustomEvent<{location: Location, scrollPosition: number}>;
            const { location, scrollPosition } = customEvent.detail;
            
            // Save the current scroll position when clicking a word
            currentScrollRef.current = scrollPosition;
            
            showProgress(true);
            const wordMorphology = await morphologyService.getWordMorphology(location);
            setWordMorphology(wordMorphology);
            showProgress(false);
            
            // Restore the same scroll position after panel opens
            setTimeout(() => {
                window.scrollTo(0, scrollPosition);
            }, 10);
        };

        window.addEventListener('wordClicked', handleWordClicked);
        
        return () => {
            window.removeEventListener('wordClicked', handleWordClicked);
        };
    }, [morphologyService]);

    // Navigation object
    const navigation = { chapterNumber };

    return (
        <div className={`flex flex-col ${wordMorphology ? 'pr-[350px]' : ''}`}>
            <CorpusHeader shouldShow={shouldShowWelcomeText} />
            {loadingTop && <LoadingBanner />}
            <div ref={loadingRefTop} />
            {
                verses.length > 0 && (
                    <div className="mx-auto max-w-4xl w-full">
                        {verseNumber === 1 && (
                            <ChapterHeader chapter={chapter} />
                        )}
                        {
                            readerMode
                                ? <ReaderView verses={verses} />
                                : <DetailView verses={verses} />
                        }
                    </div>
                )
            }
            {loadingBottom && <LoadingBanner />}
            <div ref={loadingRefBottom} />
            {wordMorphology && <WordMorphologyView wordMorphology={wordMorphology} />}
        </div>
    );
}
