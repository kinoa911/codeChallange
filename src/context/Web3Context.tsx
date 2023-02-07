import React, { ReactNode, useEffect, useState, createContext } from 'react'
import { codeChallenge } from '../config/resource';
import { toast } from 'react-toastify';
import { IPost } from '../views/home/components/Post'
import { IReply } from '../views/home/components/Reply';
import { sleep } from '../helpers/sleep';
import { client } from '../config/clients';
import { coinClient } from '../config/clients';

export interface IUserVoteStatus {
    isClickPost: boolean;
    postId: number;
    replyId: number;
    status_like: boolean;
    status_unlike: boolean;
}


export interface IContextInterface {
    address: string | null;
    isConnected: boolean;
    connect: any;
    disconnect: any;
    checkBalance: any;
    posts: any;
    userVotes: any;
    post: any;
    reply: any;
    vote: any;
    getAllData: any
}

interface Props {
    children?: ReactNode; // any props that come into the component
}

export const Web3Context = createContext<IContextInterface | null>(null);

export const Web3ContextProvider = ({ children, ...props }: Props) => {


    const [wallet, setWallet] = useState<string>('');
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [posts, setPosts] = useState<IPost[]>();
    const [userVotes, setUserVotes] = useState<IUserVoteStatus[]>();


    useEffect(() => {
        if (isConnected && wallet === 'petra') {
            window?.aptos.account().then((data: any) => {
                setAddress(data.address);
            });
        } else if (isConnected && wallet === 'martian') {
            window?.martian.account().then((data: any) => {
                setAddress(data.address);
            });
        } else if (isConnected && wallet === 'pontem') {
            window?.pontem.account().then((data: any) => {
                setAddress(data);
            });
        } else {
            setAddress(null);
        }
    }, [isConnected, wallet]);

    // update connection
    useEffect(() => {
        checkIsConnected(wallet);
    }, [wallet]);


    const connect = async (wallet: string) => {
        try {
            if (wallet === 'petra') {
                if ('aptos' in window) await window.aptos.connect();
                //  else window.open('https://petra.app/', `_blank`);
            } else if (wallet === 'martian') {
                if ('martian' in window) await window.martian.connect();
                // else window.open('https://www.martianwallet.xyz/', '_blank');
            } else if (wallet === 'pontem') {
                if ('pontem' in window) await window.pontem.connect();
                // else window.open('https://petra.app/', `_blank`);
            }
            setWallet(wallet);
            checkIsConnected(wallet);
        } catch (e) {
            console.log(e);
        }
    };

    const disconnect = async () => {
        try {
            if (wallet === 'petra') await window.aptos.disconnect();
            else if (wallet === 'martian') await window.martian.disconnect();
            else if (wallet === 'pontem') await window.pontem.disconnect();
            setWallet('');
            checkIsConnected(wallet);
        } catch (e) {
            console.log(e);
        }
    };

    const checkIsConnected = async (wallet: string) => {
        if (wallet === 'petra') {
            const x = await window.aptos.isConnected();
            setIsConnected(x);
        } else if (wallet === 'martian') {
            const x = await window.martian.isConnected();
            setIsConnected(x);
        } else if (wallet === 'pontem') {
            const x = await window.pontem.isConnected();
            setIsConnected(x);
        }
    };


    const checkBalance = async () => {
        if (isConnected && wallet === 'petra') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.aptos.account())}`);
        } else if (isConnected && wallet === 'martian') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.martian.account())}`);
        } else if (isConnected && wallet === 'pontem') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.pontem.account())}`);
        } else {
            console.log(`Account balance: 0`);
        }
    }



    const getAllData = async () => {

            const resOfResource = await client.getAccountResources(codeChallenge);
            const data = resOfResource.find((item) => (item.type === `${codeChallenge}::vote::Posts`) )

            const result: IPost[] = [];
            if(data){
                const postsData = data?.data as {posts: {length: number}};

                for(var i=0; i<postsData.posts.length; i++){
                    let _repliesData: IReply[] = [];
                    let _postData : IPost= {
                        title: "",
                        content: "",
                        poster: "",
                        postTime: 0,
                        count_like: 0,
                        count_unlike: 0,
                        replies: _repliesData
                    }

                    const post = postsData.posts[i];
                    _postData.title = post.title;
                    _postData.content = post.content;
                    _postData.poster = post.poster;
                    _postData.postTime = post.postTime;
                    _postData.count_like = post.count_like;
                    _postData.count_unlike = post.count_unlike;

                    for(var j=0; j<post.replies.length; j++){
                        let _replyData: IReply = {
                            content: "",
                            count_like: 0,
                            count_unlike: 0,
                            replyer: '',
                            replyTime: 0
                        };
                        
                        const reply = post.replies[j];
                        _replyData.content = reply.content;
                        _replyData.count_like = reply.count_like;
                        _replyData.count_unlike = reply.count_unlike;
                        _replyData.replyer = reply.replyer;
                        _replyData.replyTime = reply.replyTime;

                        _postData.replies.push(_replyData)
                    }
                    result.push(_postData);
                }
                setPosts(result)
            }

    }

    useEffect(()=>{
        getAllData();
    }, [])


    const getUserInfo = async () => {
            if(!address) return;
            const resOfAccount = await client.getAccountResources(address);
            const data = resOfAccount.find((item) => (item.type === `${codeChallenge}::vote::Votes`))
            const result: IUserVoteStatus[] = [];
            if(data){
                const votesData = data?.data as {votes: {length: number}};

                for(var i=0; i<votesData.votes.length; i++){
                    let _vote: IUserVoteStatus = {
                        isClickPost: true,
                        postId: 0,
                        replyId: 0,
                        status_like: false,
                        status_unlike: false
                    }
                    const vote = votesData.votes[i];
                    _vote.isClickPost = vote.isClickPost;
                    _vote.postId = vote.postId;
                    _vote.replyId = vote.replyId;
                    _vote.status_like = vote.status_like;
                    _vote.status_unlike = vote.status_unlike;

                    result.push(_vote)
                }
                setUserVotes(result)
            }
    }


    useEffect(()=>{
        getUserInfo();
    }, [address])

    const post = async (title: string, content: string) => {

        if (wallet === '' || !isConnected) {
            toast.warning("please connect wallet", {theme:'colored'});
            return;
        }
        try{
            const petraTransaction = {
                arguments: [title, content],
                function: codeChallenge + '::vote::post',
                type: 'entry_function_payload',
                type_arguments: [],
            };

            const sender = address;
            const payload = {
                arguments: [title, content],
                function: codeChallenge + '::vote::post',
                type_arguments: [],
            };

            let transaction;
            if (wallet === 'petra') {
                transaction = petraTransaction;
            } else if (wallet === 'martian') {
                transaction = await window.martian.generateTransaction(sender, payload);
            } else if (wallet === 'pontem') {
                // transaction = await window.pontem.generateTransaction(sender, payload);
            }

            if (isConnected && wallet === 'petra') {
                await window.aptos.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'martian') {
                await window.martian.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'pontem') {
                await window.pontem.signAndSubmit(payload);
            }

            toast.success("Posted successfully!", {theme:'colored'});
            await sleep(2);
            await getAllData();
            await getUserInfo();
        }
        catch(e){
            console.log(e)
        }
    }


    const reply = async (index: number, content: string) => {

        if (wallet === '' || !isConnected) {
            toast.warning("please connect wallet", {theme:'colored'});
            return;
        }
        try{
            const sender = address;
            const petraTransaction = {
                arguments: [ index, content],
                function: codeChallenge + '::vote::reply',
                type: 'entry_function_payload',
                type_arguments: [],
            };

            const payload = {
                arguments: [ index, content],
                function: codeChallenge + '::vote::reply',
                type_arguments: [],
            };

            let transaction;
            if (wallet === 'petra') {
                transaction = petraTransaction;
            } else if (wallet === 'martian') {
                transaction = await window.martian.generateTransaction(sender, payload);
            } else if (wallet === 'pontem') {
                // transaction = await window.pontem.generateTransaction(sender, payload);
            }

            if (isConnected && wallet === 'petra') {
                await window.aptos.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'martian') {
                await window.martian.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'pontem') {
                await window.pontem.signAndSubmit(payload);
            }

            toast.success("Replyed successfully!", {theme:'colored'});
            await sleep(2);
            await getAllData();
            await getUserInfo();
            }
        catch(e){
            console.log(e)
        }
    }



    const vote = async (isClickPost:boolean, postId: number, replyId: number, like: boolean, unlike: boolean) => {

        console.log("vote-console", isClickPost, postId, replyId, like, unlike)

        if (wallet === '' || !isConnected) {
            toast.warning("please connect wallet", {theme:'colored'});
            return;
        }
        try{
            const sender = address;
            const petraTransaction = {
                arguments: [isClickPost, postId, replyId, like, unlike],
                function: codeChallenge + '::vote::vote',
                type: 'entry_function_payload',
                type_arguments: [],
            };

            const payload = {
                arguments: [isClickPost, postId, replyId, like, unlike],
                function: codeChallenge + '::vote::vote',
                type_arguments: [],
            };

            let transaction;
            if (wallet === 'petra') {
                transaction = petraTransaction;
            } else if (wallet === 'martian') {
                transaction = await window.martian.generateTransaction(sender, payload);
            } else if (wallet === 'pontem') {
                // transaction = await window.pontem.generateTransaction(sender, payload);
            }

            if (isConnected && wallet === 'petra') {
                await window.aptos.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'martian') {
                await window.martian.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'pontem') {
                await window.pontem.signAndSubmit(payload);
            }

            toast.success("Voted successfully!", {theme:'colored'});
            await sleep(2);
            await getAllData();
            await getUserInfo();
        }
        catch(e){
            console.log(e)
        }
    }

    const contextValue: IContextInterface = {
        address,
        isConnected,
        connect,
        disconnect,
        checkBalance,
        posts,
        userVotes,
        post,
        reply,
        vote,
        getAllData
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
