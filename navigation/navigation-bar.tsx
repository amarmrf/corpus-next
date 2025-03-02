'use client';

import "reflect-metadata";

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { NavigationProps } from './navigation';
import { ChapterService } from '@/corpus/orthography/chapter-service';
import { ChevronDown } from '@/components/chevron-down';
import { Qaf } from './qaf';
import { PopupLink } from '@/components/popup-link';
import { PopupMenu } from '@/components/popup-menu';
import { VerseSelector } from './verse-selector';
import { HamburgerMenu } from './hamburger-menu';
import { IndeterminateProgressBar } from '@/components/indeterminate-progress-bar';
import { useProgress } from '@/app/progress-context';
import { container } from '@/lib/tsyringe-setup';

export const NavigationBar = (props: NavigationProps) => {
    const [showVerseSelectorPopup, setShowVerseSelectorPopup] = useState(false);
    const [showHamburgerPopup, setShowHamburgerPopup] = useState(false);
    const verseSelectorPopupRef = useRef<HTMLDivElement | null>(null);
    const hamburgerPopupRef = useRef<HTMLDivElement | null>(null);
    const selectorContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentChapter, setCurrentChapter] = useState(props.chapterNumber);
    
    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(currentChapter);
    const { progress } = useProgress();
    const pathname = usePathname();
    const params = useParams();
    
    // Update current chapter based on URL params
    useEffect(() => {
        if (params && params.location) {
            const location = (params.location as string).split(':');
            if (location.length > 0) {
                const chapterNum = parseInt(location[0], 10);
                if (!isNaN(chapterNum) && chapterNum > 0) {
                    setCurrentChapter(chapterNum);
                }
            }
        }
    }, [params]);

    return (
        <nav className="fixed top-0 w-full bg-gray-800 shadow-md z-50">
            <div className="relative h-16">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Link href="/" passHref className="h-full flex items-center">
                        <Qaf />
                    </Link>
                </div>
                
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative" ref={selectorContainerRef}>
                        <PopupLink
                            className="inline-flex items-center justify-center text-white px-3 py-2"
                            popupRef={verseSelectorPopupRef}
                            showPopup={showVerseSelectorPopup}
                            onShowPopup={setShowVerseSelectorPopup}
                        >
                            {currentChapter}. {chapter.phonetic}
                            <ChevronDown className="text-white w-4 ml-1" />
                        </PopupLink>
                    </div>
                </div>
                
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <PopupLink
                        className="flex items-center h-full cursor-pointer"
                        popupRef={hamburgerPopupRef}
                        showPopup={showHamburgerPopup}
                        onShowPopup={setShowHamburgerPopup}
                    >
                        <Image src="/images/icons/hamburger.svg" alt="Menu" width={24} height={24} />
                    </PopupLink>
                </div>
            </div>
            {progress && <IndeterminateProgressBar />}
            
            {showVerseSelectorPopup && (
                <div className="absolute left-1/2 transform -translate-x-1/2 z-50">
                    <div ref={verseSelectorPopupRef}>
                        <VerseSelector
                            chapterNumber={currentChapter}
                            onClose={() => setShowVerseSelectorPopup(false)}
                            onNavigate={(path) => {
                                setShowVerseSelectorPopup(false);
                                // Use router.push here if you need programmatic navigation
                            }}
                            baseUrl={pathname}
                        />
                    </div>
                </div>
            )}
            
            <PopupMenu ref={hamburgerPopupRef} showPopup={showHamburgerPopup} position="right">
                <HamburgerMenu onClose={() => setShowHamburgerPopup(false)} />
            </PopupMenu>
        </nav>
    );
};