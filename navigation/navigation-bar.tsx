'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
import { container } from 'tsyringe';
import hamburgerIcon from '@/images/icons/hamburger.svg';

export const NavigationBar = (props: NavigationProps) => {
    const [showVerseSelectorPopup, setShowVerseSelectorPopup] = useState(false);
    const [showHamburgerPopup, setShowHamburgerPopup] = useState(false);
    const verseSelectorPopupRef = useRef<HTMLDivElement | null>(null);
    const hamburgerPopupRef = useRef<HTMLDivElement | null>(null);

    const chapterService = container.resolve(ChapterService);
    const chapter = chapterService.getChapter(props.chapterNumber);
    const { progress } = useProgress();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full bg-gray-800 shadow-md">
            <header className="flex justify-center relative h-16">
                <Link href="/" passHref className="absolute left-0 h-full">
                    <Qaf />
                </Link>
                <PopupLink
                    className="inline-flex items-center justify-center text-white px-3 py-2"
                    popupRef={verseSelectorPopupRef}
                    showPopup={showVerseSelectorPopup}
                    onShowPopup={setShowVerseSelectorPopup}
                >
                    {props.chapterNumber}. {chapter.phonetic}
                    <ChevronDown className="text-white w-4 ml-1" />
                </PopupLink>
                <PopupLink
                    className="absolute right-0 flex items-center h-full px-4 cursor-pointer"
                    popupRef={hamburgerPopupRef}
                    showPopup={showHamburgerPopup}
                    onShowPopup={setShowHamburgerPopup}
                >
                    <Image src={hamburgerIcon} alt="Menu" width={24} height={24} />
                </PopupLink>
            </header>
            {progress && <IndeterminateProgressBar />}
            <PopupMenu ref={verseSelectorPopupRef} showPopup={showVerseSelectorPopup}>
                <VerseSelector
                    chapterNumber={props.chapterNumber}
                    onClose={() => setShowVerseSelectorPopup(false)}
                    onNavigate={(path) => {
                        setShowVerseSelectorPopup(false);
                        // Use router.push here if you need programmatic navigation
                    }}
                    baseUrl={pathname}
                />
            </PopupMenu>
            <PopupMenu ref={hamburgerPopupRef} showPopup={showHamburgerPopup}>
                <HamburgerMenu onClose={() => setShowHamburgerPopup(false)} />
            </PopupMenu>
        </nav>
    );
};