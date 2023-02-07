import React, {useContext, useState, useEffect} from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { formart } from '../../../helpers/formatAddress';
import { Web3Context } from '../../../context/Web3Context';

export interface IReply {
    content: string
    replyer: string
    replyTime: number
    count_like: number
    count_unlike: number
}

interface IPros {
    replyInfo: IReply
    postId: number
    replyId: number
}

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        // '& .MuiTypography-root': {
        //     color: 'black',
        // },
        '& .hidden_content': {
            margin: '20px',
            width:'inherit',
            // background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
            background: '#f9f9f9',
            borderRadius: '13px',
            padding: '10px',
            textAlign: 'left',
            '& .content':{
                fontSize: '16px', 
                marginBottom:'16px'
            },
            '& .icon-wrap': {
                display:'flex', 
                alignItems:'center', 
                marginRight:'20px'
            },
            '& .icon': {
                display:'flex', 
                alignItems:'center', 
                color:'gray', 
                marginRight:'8px', 
                '&:hover':{color:'red', cursor:'pointer'}
            },
            '& .icon-active': {
                display:'flex', 
                alignItems:'center', 
                color:'#fa0f90', 
                marginRight:'8px', 
                '&:hover':{color:'red', cursor:'pointer'}
            },
        },
    },
    contentView: {
        width: '100%',
        background: '#16162d', borderRadius: '24px',
        boxShadow: '0px 1px 4px #ccc',
        padding: '24px'
    }
}));




function Reply(props: IPros) {
    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const {
        content,
        replyer,
        replyTime,
        count_like,
        count_unlike
    } = props.replyInfo
    const postId = props.postId
    const replyId = props.replyId

    const replyedTime = new Date(replyTime * 1000);
    const replyDate = replyedTime.toLocaleString();

    const handleVote = async (like: boolean, unlike: boolean) => {
        await web3?.vote(false, postId, replyId, like, unlike);
    }

    const userVotesData = web3?.userVotes;
    const [statusLike, setStatusLike] = useState(false);
    const [statusUnlike, setStatusUnlike] = useState(false);

    useEffect(()=>{
        if(userVotesData){
            const data = userVotesData.find((vote) => (vote.isClickPost === false && vote.postId === String(postId) && vote.replyId === String(replyId)) )
            console.log("reply-user-data-console", data)
            if(data){
                setStatusLike(data.status_like);
                setStatusUnlike(data.status_unlike);
            }
        }

    },[userVotesData, postId, replyId])

    return (
            <Box className={classes.root}>
                <Box className="hidden_content">
                    <Typography className='content'>{content}</Typography>
                    <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'},justifyContent: 'space-between'}}>
                        <Box sx={{display:'flex', gap:'24px', alignItems:'center', marginRight:'24px'}}>
                            <Typography sx={{color: '#646464', fontWeight:'600'}}>Replyed by</Typography>
                            <Typography >{formart(replyer)}</Typography>
                            <Typography>{replyDate}</Typography>
                        </Box>
                        <Box sx={{display:'flex'}}>
                            <Box className='icon-wrap'>
                                {statusLike ? (
                                    <Box className='icon-active' onClick={() => handleVote(true, false)}>
                                        <ThumbUpOutlinedIcon/>
                                    </Box>
                                ) : (
                                    <Box className='icon' onClick={() => handleVote(true, false)}>
                                    <ThumbUpOutlinedIcon/>
                                </Box>
                                )}

                                <Typography sx={{fontSize:'24px'}}>{count_like}</Typography>
                            </Box>
                            <Box className='icon-wrap'>
                                {statusUnlike ? (
                                    <Box className='icon-active' onClick={() =>handleVote(false, true)}>
                                        <ThumbDownOffAltOutlinedIcon/>
                                    </Box>
                                ) : (
                                    <Box className='icon' onClick={() =>handleVote(false, true)}>
                                        <ThumbDownOffAltOutlinedIcon/>
                                    </Box>
                                )}
                                <Typography sx={{fontSize:'24px'}}>{count_unlike}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
    );
}

export default Reply;
