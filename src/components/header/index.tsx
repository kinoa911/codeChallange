import React from 'react'
import { makeStyles } from '@mui/styles'
import {  Box  } from '@mui/material'


import ConnectButton from './ConnectButton'
import PostButton from './PostButton'


interface IHeader {
    handleDrawerToggle?: () => void;
    title: string;
}

const useStyles = makeStyles((theme) => ({
    topBar: {
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px -1px rgb(0 0 0 / 25%)',
        width: '100%',
        padding: '15px 0',
        zIndex: 100,

    },

})) as any;



function Header({ handleDrawerToggle }: IHeader) {

    const classes = useStyles();

    return (
        <div className={classes.topBar}>
            <Box
                sx={{
                    justifyContent: 'flex-end',
                    marginLeft: '20px',
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <ConnectButton />
                <PostButton/>
            </Box>
        </div >
    );
}

export default Header;
