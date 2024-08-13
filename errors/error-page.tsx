import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { CalligraphyLogo } from '../components/calligraphy-logo';
import { CorpusError, ErrorCode } from './corpus-error';
// import { Footer } from '../components/footer';

const errorCodeDescriptionMap = new Map<ErrorCode, string>([
    ['404', 'We\'re sorry, the page you were looking for couldn\'t be found.']
]);

interface ErrorPageProps {
    statusCode?: number;
    message?: string;
}

const ErrorPage = ({ statusCode, message }: ErrorPageProps) => {
    const router = useRouter();

    useEffect(() => {
        console.error('Error occurred:', { statusCode, message });
    }, [statusCode, message]);

    let description;
    let displayMessage = message || 'Something went wrong!';

    if (statusCode === 404) {
        displayMessage = 'Page not found';
        description = errorCodeDescriptionMap.get('404');
    } else if (statusCode && errorCodeDescriptionMap.has(statusCode.toString() as ErrorCode)) {
        description = errorCodeDescriptionMap.get(statusCode.toString() as ErrorCode);
    }

    return (
        <div className='error-page'>
            {/* <CalligraphyLogo /> */}
            <h1>{displayMessage}</h1>
            {description && <p className='description'>{description}</p>}
            <p>
                <Link href='/'>The Quranic Arabic Corpus</Link>
            </p>
            {/* Note: You'll need to import or create a Footer component */}
            {/* <Footer /> */}
        </div>
    );
};

export default ErrorPage;

export async function getServerSideProps(context: any) {
    const { res, err } = context;
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { props: { statusCode } };
}