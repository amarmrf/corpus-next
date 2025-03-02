'use client';

import "reflect-metadata";
import { ReactNode, useEffect, useRef, useState } from 'react';
import { combineClassNames } from '@/theme/class-names';
import { Footer } from '@/components/footer';

type MainLayoutClientProps = {
    children: ReactNode
}

export function MainLayoutClient({ children }: MainLayoutClientProps) {
    const [infoPaneWidth, setInfoPaneWidth] = useState(400);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const splitterRef = useRef<HTMLDivElement | null>(null);

    // Default values
    const focusMode = false;
    const info: ReactNode | undefined = undefined;
    const className = '';

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

        const splitterRefCurrent = splitterRef.current;
        if (splitterRefCurrent) {
            splitterRefCurrent.addEventListener('mousedown', handleMouseDown);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (splitterRefCurrent) {
                splitterRefCurrent.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [isDragging]);

    return (
        <div
            ref={workspaceRef}
            className={`flex flex-col mt-[var(--app-header-height)] sm:grid sm:h-[calc(100vh-var(--app-header-height))] ${info ? 'sm:grid-cols-[1fr_10px_auto]' : 'sm:grid-cols-[1fr]'}`}
            style={{ gridTemplateColumns: info ? `1fr 10px ${infoPaneWidth}px` : `1fr` }}
        >
            <main className={`${className} sm:overflow-y-scroll`}>
                {children}
                <Footer type='desktop' />
            </main>
            <div 
                ref={splitterRef} 
                className={`hidden sm:flex sm:items-center sm:justify-center sm:cursor-col-resize sm:select-none ${!info ? 'sm:hidden' : ''}`}
            >
                <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            {
                info &&
                <>
                    {focusMode && <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" />}
                    <div className={`
                        sm:overflow-y-scroll
                        ${focusMode ? 'fixed bottom-0 w-[calc(100%-20px)] h-[90%] z-10 bg-white overflow-y-scroll mx-2.5 rounded-t-2xl sm:static sm:w-auto sm:h-auto sm:z-auto sm:bg-transparent sm:overflow-visible sm:m-0 sm:rounded-none' : ''}
                    `}>
                        {info}
                    </div>
                </>
            }
            <Footer type='mobile' />
        </div>
    );
} 