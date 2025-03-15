import { MouseEvent } from 'react';
import { useSettings } from '../settings/settings-context';
import { TranslationService } from '../corpus/translation/translation-service';
import { SettingsService } from '../settings/settings-service';
import { container } from 'tsyringe';
import { Book, Check } from 'lucide-react';

type Props = {
    onClose: () => void
}

export const HamburgerMenu = ({ onClose }: Props) => {
    const translationService = container.resolve(TranslationService);
    const settingsService = container.resolve(SettingsService);
    const translations = translationService.translations;

    const { settings } = useSettings();
    const { readerMode } = settings;

    const toggleReaderMode = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        // Save current scroll position before toggling
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate the relative position in the document (0 to 1)
        const scrollRatio = scrollPosition / (documentHeight - viewportHeight);
        
        // Find a currently visible element to use as reference point
        let visibleElementId: string | null = null;
        const elements = document.querySelectorAll('[id^="verse-"]');
        
        // Convert to array to use proper array methods and find a visible element
        Array.from(elements).some(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is in viewport
            if (rect.top >= 0 && rect.top <= window.innerHeight) {
                visibleElementId = el.id;
                return true;
            }
            return false;
        });
        
        settingsService.saveSettings({
            ...settings,
            readerMode: !readerMode
        });
        
        // After state update and re-render, restore scroll position
        setTimeout(() => {
            // First try to scroll to the same verse element if found
            if (visibleElementId) {
                const element = document.getElementById(visibleElementId);
                if (element) {
                    element.scrollIntoView({ block: 'center' });
                    return;
                }
            }
            
            // If no element found or scrolling to it failed, try to maintain relative position
            const newDocumentHeight = document.documentElement.scrollHeight;
            const newScrollPosition = scrollRatio * (newDocumentHeight - viewportHeight);
            
            // Ensure we don't scroll past the document's height
            const safeScrollPosition = Math.min(newScrollPosition, newDocumentHeight - viewportHeight);
            
            // Apply the new scroll position
            window.scrollTo(0, safeScrollPosition);
        }, 100);
        
        onClose();
    }

    const toggleTranslation = (e: MouseEvent<HTMLButtonElement>, key: string) => {
        e.preventDefault();
        settingsService.saveSettings({
            ...settings,
            translations: translationService.toggleTranslation(settings.translations, key)
        });
        onClose();
    }

    return (
        <div className="bg-black text-white p-4 w-64">
            <button 
                onClick={toggleReaderMode} 
                className="flex items-center space-x-3 w-full p-2 hover:bg-gray-800 rounded"
            >
                <Book size={20} />
                <span>{readerMode ? 'Detail mode' : 'Reader mode'}</span>
            </button>
            
            <div className="mt-4 mb-2">Translations:</div>
            {translations.map((translation, i) => {
                const { key, name } = translation;
                const isSelected = settingsService.hasTranslation(key);
                return (
                    <button
                        key={`translation-${i}`}
                        onClick={(e) => toggleTranslation(e, key)}
                        className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded"
                    >
                        <span>{name}</span>
                        {isSelected && <Check size={20} />}
                    </button>
                )
            })}
        </div>
    )
}