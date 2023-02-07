import React, { useState, useContext } from 'react';

// import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, Modal, useMediaQuery } from '@mui/material';

import PontemWallet from '../../assets/icons/Pontem.png'
import MartianIcon from '../../assets/icons/Martian.jpg';
import PetraIcon from '../../assets/icons/Petra.jpg';
import { IconX } from '@tabler/icons';
import { formart } from '../../helpers/formatAddress';
import { Web3Context } from '../../context/Web3Context';


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'white',
    p: 4,
    borderRadius: '4px',
    color: 'black',
};

const connectButtonStyle = {
    color: 'white',
    padding: '8px 20px',
    // backgroundImage: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
    background: '#42b983',
    // borderRadius: '200px',
    marginRight: '20px',
    minWidth: '120px',
}

const connectWalletStyle = {
    display: 'flex',
    width: '100%',
    color: 'black',
    background: '#42b983',
    padding: '8px 20px',
    borderColor: 'gray',
    borderStyle: 'groove',
    // borderRadius: '50px',
    border: '1px gray solid',
    my: 2,
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0px 0px 4px #5361DC60',
    }
}



const wallets = [
    {
        logo: PontemWallet,
        name: 'Pontem',
    },
    {
        logo: MartianIcon,
        name: 'Martian',
    },
    {
        logo: PetraIcon,
        name: 'Petra',
    },
];

function ConnectButton() {
    const isXs = useMediaQuery('(max-width:375px)');
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);

    const web3 = useContext(Web3Context)



    const onConnectWallet = async (wallet: string) => {
        await web3?.connect(wallet)
        setOpenModal1(false)
    }

    const onDisconnectWallet = async () => {
        await web3?.disconnect();
        setOpenModal2(false);
    }

    const userAddress = web3?.address
    return (
        <div>
            <Box sx={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                <Button 
                    sx={{...connectButtonStyle, '&:hover':{background: '#328b62'}}} 
                    onClick={() => {
                        if(!(web3?.isConnected)) setOpenModal1(!openModal1)
                        else setOpenModal2(!openModal2)
                    }}
                >
                    {userAddress ? formart(userAddress) : isXs ? 'Connect' : 'Connect Wallet'}
                </Button>
            </Box>
            <Modal open={openModal1} onClose={()=> {setOpenModal1(false)}}>
                <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <Typography variant="h5" sx={{ display: 'flex', color: 'black', fontWeight:'500' }}>
                            Connect Wallet
                        </Typography>
                        <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }} onClick={() => setOpenModal1(false)}>
                            <IconX />
                        </Box>
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: 'left', mb: 3, color: 'black', fontSize: '14px' }}>
                        To continue working with the site, you need to connnect a wallet and allow the site access to your account
                    </Typography>
                    {wallets.map((wallet, index) => (
                        <Box
                            key={index}
                            sx={connectWalletStyle}
                            onClick={() => onConnectWallet(wallet.name.toLocaleLowerCase())}
                        >
                            <img
                                src={wallet.logo}
                                alt="martian_logo"
                                style={{ width: '25px', height:'25px' }}
                            />
                            <Typography sx={{ display: 'flex', alignItems: 'center', px: 3, color:'white', fontWeight:'500' }}>{wallet.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Modal>
            <Modal open={openModal2} onClose={()=> {setOpenModal2(false)}}>
                <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <Typography variant="h5" sx={{ display: 'flex', color: 'black', fontWeight:'500' }}>
                            Disconnect
                        </Typography>
                        <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }} onClick={() => setOpenModal2(false)}>
                            <IconX />
                        </Box>
                    </Box>
                        <Box
                            sx={{...connectWalletStyle, justifyContent:'center', color:'white', fontWeight:'500'}}
                            onClick={onDisconnectWallet}
                        >
                            Disconnect
                        </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default ConnectButton;
