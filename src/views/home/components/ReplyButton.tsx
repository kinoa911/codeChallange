import React, { useState, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, Modal, TextField } from '@mui/material';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { IconX } from '@tabler/icons';
import { Web3Context } from '../../../context/Web3Context';

const useStyles = makeStyles((theme: any) => ({
    replyIconButtonView: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        '& .replyIconButton': {
            color:'black', 
            '&:hover': {color:'red', cursor:'pointer'}
        },
    },
    replyTextField: {
        "& .MuiOutlinedInput-root": {
            color: "black",
            // borderRadius: '10px',
            borderColor: '#888',
            "&.Mui-focused fieldset": {
                borderColor: '#888'
            },
            '& fieldset': {
                borderColor: '#888',
            },
        },
        "& .MuiOutlinedInput-root:hover": {
            "& > fieldset": {
                borderColor: "#888"
            }
        }
    },

}));
const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'white',
    p: 4,
    borderRadius: '4px',
    color: 'white',
};

const replyButtonStyle = {
    mt: 3,
    display: 'flex',
    width: '100%',
    //backgroundColor: '#5361DC',
    background: '#42b983',
    boxShadow: '0px 0px 4px #5361DC60',
    borderColor: 'gray',
    border: '1px gray solid',
    // borderRadius: '10px',
    py: 2,
    '&:hover': {
        backgroundColor: '#328b62',
        boxShadow: '0px 0px 4px #5361DC60',
    }
}

function ReplyButton(props: {postId: number}) {
    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');

    const handleReply = async () => {
        await web3?.reply(props.postId, content);
        setOpen(false);
    }

    return (
        <div>
            <Box className={classes.replyIconButtonView}>
                <Box className='replyIconButton' onClick={() => setOpen(!open)}>
                    <ReplyOutlinedIcon/>
                </Box>
            </Box>
            <Modal open={open} onClose={()=>{setOpen(false)}}>
                <Box sx={{ ...modalStyle, width: { xs: '90%', md: '700px' } }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <Typography variant="h5" sx={{ display: 'flex', color: 'black' }}>
                            Reply
                        </Typography>
                        <Box
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                            onClick={() => setOpen(false)}
                        >
                            <IconX />
                        </Box>
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            multiline
                            rows='7'
                            type="text"
                            className={classes.replyTextField}
                            value={content}
                            onChange={(e)=>{setContent(e.target.value)}}
                        />
                    </Box>
                    <Button 
                        sx={replyButtonStyle}
                        disabled={!content}
                        onClick={handleReply}
                    >
                        <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Reply</Typography>
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default ReplyButton;
