import React, {useContext } from 'react';
import Container from '../../components/container';
import Post from './components/Post';
import { IPost } from './components/Post'
import { Web3Context } from '../../context/Web3Context';


const initial_posts : IPost[] = [
    {   
        title: '',
        content: '',
        poster: '',
        postTime: 0,
        count_like: 0,
        count_unlike: 0,
        replies: [
            {
                content: '',
                replyer: '',
                replyTime: 0,
                count_like: 0,
                count_unlike: 0
            },
        ]
    }
]

function Home() {
    const web3 = useContext(Web3Context)

    const posts = web3?.posts?? initial_posts;

    return (
        <Container>
            {posts.map((post, index) => (
                <Post postInfo={post} postId={index} key={index}/>
            ))}
        </Container>
    );
}

export default Home;
