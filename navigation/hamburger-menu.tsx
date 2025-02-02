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
        settingsService.saveSettings({
            ...settings,
            readerMode: !readerMode
        })
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