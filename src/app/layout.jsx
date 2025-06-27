// import SettingsIcon from '@mui/icons-material/Settings';

export default function RootLayout ({ children }) {
    return (
        <html lang="en">
            <body>
                {/* <SettingsIcon className='settings-button'/> */}
                {children}
            </body>
        </html>
    );
}
