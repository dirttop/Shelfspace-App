import { DevConfig } from '@/constants/DevConfig';
import { Redirect } from 'expo-router';

const StartPage = () => {
    if (DevConfig.enableDevRouting) {
        return <Redirect href={DevConfig.initialRoute as any} />;
    }
    return <Redirect href="/(main)/welcome" />;
};

export default StartPage;