import React, {useState, useContext, useEffect} from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Reply from './Reply';
import ReplyButton from './ReplyButton';
import { IReply } from './Reply';
import { formart } from '../../../helpers/formatAddress';
import { Web3Context } from '../../../context/Web3Context';

export interface IPost {
    title: string
    content: string
    poster: string
    postTime: number
    count_like: number
    count_unlike: number
    replies: Array<IReply>
}

interface IProps {
    postInfo : IPost,
    postId: number
}


const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        marginBottom: '36px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        // '& .MuiTypography-root': {
        //     color: 'black',
        // },
    },
    contentView: {
        width: '100%',
        background: '#e2f5ec', 
        // borderRadius: '24px',
        boxShadow: '0px 1px 4px #ccc',
        padding: '24px',
        '& .title': {
            fontSize: '24px', 
            marginBottom:'8px',
            fontWeight:'700'
        },
        '& .content': {
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
        '& .vote-text': {
            fontSize:'24px'
        },
        '& .replies': {
            display: 'flex',
            width:'fit-content',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color:'black',
            marginTop:'24px',
            '&:hover': {
                color: 'green',
            },
        }

    }
}));



function Post(props: IProps) {
    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const [dropOpen, setDropOpen] = useState(false);

    const {
        title,
        content,
        poster,
        postTime,
        count_like,
        count_unlike,
        replies,
    } = props.postInfo
    const postId = props.postId

    const postedTime = new Date(postTime * 1000);
    const postDate = postedTime.toLocaleString();

    const handleVote = async (like: boolean, unlike: boolean) => {
        await web3?.vote(true, postId, 0, like, unlike);
    }

    const userVotesData = web3?.userVotes;
    const [statusLike, setStatusLike] = useState(false);
    const [statusUnlike, setStatusUnlike] = useState(false);

    useEffect(()=>{
        if(userVotesData){
            const data = userVotesData.find((vote) => (vote.isClickPost === true && vote.postId === String(postId)) )
            console.log("post-user-vote-console", data)
            if(data){
                setStatusLike(data.status_like);
                setStatusUnlike(data.status_unlike);
            }
        }

    },[userVotesData, postId])

    return (
            <Box className={classes.root}>
                <Box className={classes.contentView}>
                    <Typography className='title'>{title}</Typography>
                    <Typography className='content'>{content}</Typography>
                    <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}, justifyContent: 'space-between'}}>
                        <Box>
                            <Box sx={{display:'flex', gap:'24px'}}>
                                <Typography sx={{color: '#646464', fontWeight:'600'}}>Posted by </Typography>
                                <Typography >{formart(poster)}</Typography>
                                <Typography>{postDate}</Typography>
                            </Box>
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
                                <Typography className='vote-text'>{count_like}</Typography>
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
                                <Typography className='vote-text'>{count_unlike}</Typography>
                            </Box>
                            <Box sx={{display:'flex', alignItems:'center'}}>
                                <ReplyButton postId={postId}/>
                            </Box>
                        </Box>
                    </Box>
                    <Box className='replies' onClick={() => setDropOpen(!dropOpen)}>
                            show replies{dropOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Box>
                    <Collapse in={dropOpen} >
                         {  replies.map((reply, index)=>(
                                <Reply replyInfo={reply} postId={postId} replyId={index} key={index}/>
                            ))
                         }
                    </Collapse>
                </Box>
            </Box>
    );
}

export default Post;
