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
        <nav className='navigation-bar'>
            <header>
                <Link href='/' passHref>
                    <Qaf />
                </Link>
                <PopupLink
                    className='chapter-name'
                    popupRef={verseSelectorPopupRef}
                    showPopup={showVerseSelectorPopup}
                    onShowPopup={setShowVerseSelectorPopup}
                >
                    {props.chapterNumber}. {chapter.phonetic}
                    <ChevronDown className='down' />
                </PopupLink>
                <PopupLink
                    className='hamburger'
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