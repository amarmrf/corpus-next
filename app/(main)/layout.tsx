'use client';

import "reflect-metadata";
import { ReactNode, useEffect, useRef, useState } from 'react';
import { NavigationBar } from '@/navigation/navigation-bar';
import { NavigationProps } from '@/navigation/navigation';
//import { Footer } from '@/components/footer';
import { combineClassNames } from '@/theme/class-names';
import '@/app/(main)/styles.scss';

type LayoutProps = {
    children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
    const [infoPaneWidth, setInfoPaneWidth] = useState(400);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const splitterRef = useRef<HTMLDivElement | null>(null);

    // We'll need to get these props from somewhere else, possibly context or server components
    const navigation: NavigationProps = {} as NavigationProps; // You'll need to populate this
    const focusMode = false; // You'll need to determine how to set this
    const info: ReactNode | undefined = undefined; // You'll need to determine how to set this
    const className = ''; // You'll need to determine how to set this

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !workspaceRef.current) return;
            const containerRect = workspaceRef.current.getBoundingClientRect();
            const newSplitterPosition = containerRect.right - e.clientX;
            setInfoPaneWidth(newSplitterPosition);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true);
            e.preventDefault();
        };

        if (splitterRef.current) {
            splitterRef.current.addEventListener('mousedown', handleMouseDown);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (splitterRef.current) {
                splitterRef.current.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [isDragging]);

    return (
        <>
            {/* <NavigationBar {...navigation} /> */}
            <div
                ref={workspaceRef}
                className='workspace'
                style={{ gridTemplateColumns: info ? `1fr 10px ${infoPaneWidth}px` : `1fr` }}>
                <main className={className}>
                    {children}
                    {/* <Footer type='desktop' /> */}
                </main>
                <div ref={splitterRef} className={combineClassNames('splitter', !info ? 'hide' : undefined)}>
                    <div className='line' />
                </div>
                {
                    info &&
                    <>
                        {focusMode && <div className='popup-overlay' />}
                        <div className={combineClassNames('info-pane', focusMode ? 'popup' : undefined)}>
                            {info}
                        </div>
                    </>
                }
                {/* <Footer type='mobile' /> */}
            </div>
        </>
    )
}