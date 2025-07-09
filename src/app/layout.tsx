import SettingsIcon from '@mui/icons-material/Settings';
import type { JSX } from 'react';

export default function RootLayout ({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang='en'>
            <body>
                <SettingsIcon className='settings-button' />
                {children}
            </body>
        </html>
    );
}
