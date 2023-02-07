import React, { useState, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, Modal, TextField } from '@mui/material';
import { IconX } from '@tabler/icons';
import { Web3Context } from '../../context/Web3Context';


const useStyles = makeStyles((theme: any) => ({
    postButtonWrap: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    titleFextField: {
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
    contentTextField: {
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
    }

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
    color: 'black',
};

const modalPostButtonStyle = {
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

const postButtonStyle = {
    color: 'white',
    padding: '8px 20px',
    // backgroundImage: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
    background: '#42b983',
    // borderRadius: '200px',
    marginRight: '20px',
    minWidth: '120px',
}




function PostButton() {
    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handlePost = async () => {
        await web3?.post(title, content);
        setOpen(false);
    }

    return (
        <div>
            <Box  className={classes.postButtonWrap}>
                <Button sx={{...postButtonStyle, '&:hover':{background: '#328b62'}}} onClick={() => setOpen(!open)}>
                    Post
                </Button>
            </Box>
            <Modal open={open} onClose={()=>setOpen(false)}>
                <Box sx={{ ...modalStyle, width: { xs: '90%', md: '700px' } }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <Typography variant="h5" sx={{ display: 'flex', color: 'black' }}>
                            Post
                        </Typography>
                        <Box
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                            onClick={() => setOpen(false)}
                        >
                            <IconX />
                        </Box>
                    </Box>
                    <Box sx={{marginBottom:'16px'}}>
                        <Typography>Title</Typography>
                        <TextField
                                fullWidth
                                type="text"
                                className={classes.titleFextField}
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                            />
                    </Box>
                    <Box>
                        <Typography>Content</Typography>
                        <TextField
                                fullWidth
                                multiline
                                rows='7'
                                type="text"
                                className={classes.contentTextField}
                                value={content}
                                onChange={(e)=>setContent(e.target.value)}
                            />
                    </Box>
                    <Button 
                        sx={modalPostButtonStyle}
                        disabled={!title || !content}
                        onClick={handlePost}
                    >
                        <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Post</Typography>
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default PostButton;
