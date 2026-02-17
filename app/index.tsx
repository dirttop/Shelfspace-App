import { DevConfig } from '@/constants/DevConfig';
import { Redirect } from 'expo-router';

const StartPage = () => {
    // Check if dev routing is enabled
    if (DevConfig.enableDevRouting) {
        return <Redirect href={DevConfig.initialRoute as any} />;
    }

    // Default production routing
    return <Redirect href="/(main)/welcome" />;
};

export default StartPage;