// src/features/dashboard/routes/Dashboard.tsx

import {DwellTimeChart, TrafficChart} from '../components/Charts';
import {ScreenStatusCard} from '../components/ScreenStatusCard';
import {LocationMap} from '../components/LocationMap';
import {useAuthStore} from '../../../store/auth/auth.store';
import {Card} from '../../../components/ui';
import {useTheme} from '../../../contexts/ThemeContext';

export const Dashboard = () => {
    // 1. Use the useAuthStore to get the user data
    const user = useAuthStore((state) => state.user);
    const {currentTheme} = useTheme();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1
                    className="text-3xl font-bold"
                    style={{color: currentTheme.colors.text.primary}}
                >
                    Dashboard
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    elevated
                    padding="lg"
                    style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.brand.primary}, ${currentTheme.colors.brand.secondary})`,
                        color: currentTheme.colors.text.inverse
                    }}
                >
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-xl font-bold">
                            Welcome back,
                        </h2>
                        <h3 className="text-lg font-semibold">
                            {user?.username}
                        </h3>
                    </div>
                    <p className="mt-1 opacity-90">Here's your digital signage overview.</p>
                </Card>
                <LocationMap />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card elevated padding="lg">
                    <h2
                        className="text-lg font-bold mb-4 text-center"
                        style={{color: currentTheme.colors.text.primary}}
                    >
                        Traffic Analysis
                    </h2>
                    {/* Responsive height for the chart container */}
                    <div className="h-64 md:h-72">
                        <TrafficChart />
                    </div>
                </Card>

                <Card elevated padding="lg">
                    <h2
                        className="text-lg font-bold mb-4 text-center "
                        style={{color: currentTheme.colors.text.primary}}
                    >
                        Dwell Time
                    </h2>
                    <div className="h-64 md:h-72">
                        <DwellTimeChart />
                    </div>
                </Card>
            </div>

            {/* This component can now also be updated to use the new Card internally */}
            <div className="mt-6">
            <ScreenStatusCard />
        </div>
        </div>
    );
};