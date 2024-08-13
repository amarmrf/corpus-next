'use client';

import { useEffect, useRef, useState } from 'react';
import { ChapterService } from '@/corpus/orthography/chapter-service';
import { MorphologyService } from '@/corpus/morphology/morphology-service';
import { Verse } from '@/corpus/orthography/verse';
import { useSettings } from '@/settings/settings-context';
import { ChapterHeader } from '@/word-by-word/chapter-header';
import { CorpusHeader } from '@/components/corpus-header';
import { LoadingBanner } from '@/components/loading-banner';
import { ReaderView } from '@/word-by-word/reader-view';
import { DetailView } from '@/word-by-word/detail-view';
import { container } from 'tsyringe';

interface WordByWordContentProps {
  chapterNumber: number;
  verseNumber: number;
}

export function WordByWordContent({ chapterNumber, verseNumber }: WordByWordContentProps) {
  const chapterService = container.resolve(ChapterService);
  const morphologyService = container.resolve(MorphologyService);
  const chapter = chapterService.getChapter(chapterNumber);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const { readerMode, translations } = settings;

  useEffect(() => {
    const loadVerses = async () => {
      setLoading(true);
      const loadedVerses = await morphologyService.getMorphology([chapterNumber, verseNumber], 10, translations);
      setVerses(loadedVerses);
      setLoading(false);
    };

    loadVerses();
  }, [chapterNumber, verseNumber, translations]);

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <div className='word-by-word'>
      <CorpusHeader />
      {verses.length > 0 && verses[0].location[1] === 1 && (
        <>
          <ChapterHeader chapter={chapter} />
          {/* Add Bismillah component here */}
        </>
      )}
      {readerMode ? (
        <ReaderView verses={verses} />
      ) : (
        <DetailView verses={verses} />
      )}
    </div>
  );
}