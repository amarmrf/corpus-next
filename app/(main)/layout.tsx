import "reflect-metadata"
import { ReactNode } from 'react';
import { NavigationBar } from '@/navigation/navigation-bar';
import { NavigationProps } from '@/navigation/navigation';
import { Footer } from '@/components/footer';
import { MainLayoutClient } from '@/app/(main)/main-layout-client';

type LayoutProps = {
    children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
    // Default to chapter 1
    const navigation: NavigationProps = { chapterNumber: 1 };
    
    return (
        <>
            <NavigationBar {...navigation} />
            <MainLayoutClient>
                {children}
            </MainLayoutClient>
        </>
    );
}