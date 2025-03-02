import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { Workspace } from '../app/workspace';
import { GraphLocation } from '../corpus/syntax/graph-location';
import { formatLocation, parseLocation } from '../corpus/orthography/location';
import { SyntaxService } from '../corpus/syntax/syntax-service';
import { IrabService } from '../corpus/irab/irab-service';
import { SyntaxGraph } from '../corpus/syntax/syntax-graph';
import { SyntaxGraphView } from './syntax-graph-view';
import { CorpusError } from '../errors/corpus-error';
import { PrevNextNavigation } from '../navigation/prev-next-navigation';
import { IrabView } from './irab-view';
import { useProgress } from '../app/progress-context';
import { AxiosError } from 'axios';
import { container } from 'tsyringe';
// import './treebank.scss';

export const treebankLoader = ({ params, request }: LoaderFunctionArgs): GraphLocation => {
    const location = parseLocation(params.location!);
    const graphParam = new URL(request.url).searchParams.get('graph');
    const graphNumber = graphParam ? Number(graphParam) : 1;

    if (isNaN(location[0]) || isNaN(graphNumber)) {
        throw new CorpusError('404', 'Page not found');
    }
    return {
        location: location.length === 1 ? [location[0], 1] : location,
        graphNumber
    }
}

export const Treebank = () => {
    const graphLocation = useLoaderData() as GraphLocation;
    const { location, graphNumber } = graphLocation;
    const [chapterNumber, verseNumber] = location;
    const { showProgress } = useProgress();
    const [syntaxGraph, setSyntaxGraph] = useState<SyntaxGraph | null>(null);
    const [irab, setIrab] = useState<string[] | null>(null);
    const syntaxService = container.resolve(SyntaxService);
    const irabService = container.resolve(IrabService);

    useEffect(() => {
        (async () => {
            showProgress(true);
            try {
                var syntaxGraph = await syntaxService.getSyntax(graphLocation);
                var tokenRange = syntaxGraph.getTokenRange();
                var irab = tokenRange ? await irabService.getIrab(tokenRange.from, tokenRange.to) : null;

                setSyntaxGraph(syntaxGraph);
                setIrab(irab);

            } catch (e) {
                if (e instanceof AxiosError && e.response?.status === 404) {
                    setSyntaxGraph(null);
                    setIrab(null);
                } else {
                    throw e;
                }
            }
            showProgress(false);
        })();
    }, [chapterNumber, verseNumber, graphNumber])

    const getGraphUrl = (graphLocation?: GraphLocation) => {
        if (!graphLocation) return undefined;
        const { location, graphNumber } = graphLocation;
        const url = `/treebank/${formatLocation(location)}`;
        return graphNumber === 1 ? url : `${url}?graph=${graphNumber}`;
    }

    return (
        <Workspace
            className='treebank'
            navigation={{ chapterNumber }}
            focusMode={false}
            info={irab && <IrabView irab={irab} />}>
            <h1>Corpus 2.0: Renderer Test</h1>
            <p>
                This page tests a new vector renderer for Quranic Arabic Corpus 2.0 We're comparing the
                under-development vector-rendered image (first) with the existing bitmap-rendered image
                (second). The vector image may not fully replicate the dependency graph yet.
            </p>
            {
                syntaxGraph &&
                <>
                    <nav className='navigation'>
                        <div className='location'>
                            <div>Verse {verseNumber}</div>
                            {
                                syntaxGraph.graphCount > 1 &&
                                <div>Graph <strong>{graphNumber} / {syntaxGraph.graphCount}</strong></div>
                            }
                        </div>
                        <PrevNextNavigation
                            prevUrl={getGraphUrl(syntaxGraph.prev)}
                            nextUrl={getGraphUrl(syntaxGraph.next)} />
                    </nav>
                    <SyntaxGraphView syntaxGraph={syntaxGraph} />
                    {
                        syntaxGraph.legacyCorpusGraphNumber > 0 &&
                        <img className='legacy-graph' src={`https://corpus.quran.com/graphimage?id=${syntaxGraph.legacyCorpusGraphNumber}`} />
                    }
                </>
            }
        </Workspace>
    )
}