import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { Web3ContextProvider } from './context/Web3Context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './views/home';
import ViewBase from './components/viewbase';



import {
    PontemWalletAdapter,
    HippoWalletAdapter,
    AptosWalletAdapter,
    HippoExtensionWalletAdapter,
    MartianWalletAdapter,
    FewchaWalletAdapter,
    WalletProvider,
    WalletAdapter
} from '@manahippo/aptos-wallet-adapter';

const wallets = [
    new PontemWalletAdapter(),
    new MartianWalletAdapter(),
    new AptosWalletAdapter(),
    new FewchaWalletAdapter(),
    new HippoWalletAdapter(),
    new HippoExtensionWalletAdapter(),
] as WalletAdapter<string>[];


export default function App() {
    const theme = createTheme({
        typography: {
            fontFamily: '',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
    });


    return (
            <Web3ContextProvider>
                <WalletProvider
                    wallets={wallets}
                    onError={(error: Error) => {
                        console.log('Handle Error Message', error)
                    }}
                >
                    <BrowserRouter>

                        <ThemeProvider theme={theme}>
                            <ViewBase>
                                <ToastContainer autoClose={3000} limit={3} pauseOnFocusLoss={false} />
                                <Routes>
                                    <Route path="/" element={<Navigate to="/home" replace />} />
                                    <Route path={'/home'} element={<Home />} />
                                </Routes>
                            </ViewBase>
                        </ThemeProvider>
                    </BrowserRouter>
                </WalletProvider>
            </Web3ContextProvider >
    );
}
