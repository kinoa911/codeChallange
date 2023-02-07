module codeChallenge::vote {
    
    use std::signer;
    use std::vector;

    use aptos_std::math64::pow;
    use std::string::{Self, String, utf8};
    use aptos_std::simple_map::{Self, SimpleMap};

    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::genesis;
    use aptos_framework::timestamp;
    use aptos_framework::managed_coin;
    use aptos_framework::resource_account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::aptos_coin::AptosCoin;


    const ZERO_ACCOUNT: address = @zero;
    // const DEFAULT_ADMIN: address = @default_admin;
    const RESOURCE_ACCOUNT: address = @codeChallenge; //MODULE_ADMIN
    const DEV: address = @default_account;


    const MAX_U64: u64 = 18446744073709551615;
    const MINIMUM_LIQUIDITY: u128 = 1000;

    const NOT_ADMIN_PEM: u64 = 0;
    const AMOUNT_ZERO: u64 = 4;

    const ERROR_CANNOT_VOTE: u64 = 1;
    const ERROR_CANNOT_REPLY: u64 = 2;
    const ERROR_SET_INDEX_POST: u64 = 3;
    const ERROR_NOT_EXIST: u64 = 4;


    struct Vote has key, copy, store, drop {
        isClickPost: bool,
        
        postId: u64,
        replyId: u64,
        status_like: bool,
        status_unlike: bool,
    }

    struct Votes has key, copy, store, drop {
        votes: vector<Vote>,
    }

    struct ReplyInfo has key, copy, store, drop {
        replyer: address,
        replyTime: u64,

        count_like: u64,
        count_unlike: u64,

        content: String,
    }

    struct PostInfo has key, copy, store, drop {
        poster: address,
        postTime: u64,

        count_like: u64,
        count_unlike: u64,

        title: String,
        content: String,

        replies: vector<ReplyInfo>,
    }

    struct Posts has key, copy, store, drop {
        posts: vector<PostInfo>,
    }

    // This struct stores an NFT collection's relevant information
    struct ModuleData has key {
        // Storing the signer capability here, so the module can programmatically sign for transactions
        signer_cap: SignerCapability,
    }

    fun init_module(sender: &signer) {
        let signer_cap = resource_account::retrieve_resource_account_cap(sender, DEV);
        let resource_signer = account::create_signer_with_capability(&signer_cap);
        move_to(&resource_signer, ModuleData {
            signer_cap,
        });
    }

    public entry fun vote(
        sender: &signer,
        isClickPost: bool, //true: post, false: reply
        postId: u64,
        replyId: u64,
        like: bool, //click like
        unlike: bool, //click unlike
    ) acquires ModuleData, Posts, Votes {

        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);


        //set position for wallet and position count
        let signer_addr = signer::address_of(sender);

        // assert!(like && unlike, ERROR_SELECT_LIKE_UNLIKE);

        let posts = borrow_global_mut<Posts>(resource_account_addr);
        let postInfo = vector::borrow_mut(&mut posts.posts, postId);

        let voteInfo = Vote {
            isClickPost: isClickPost,
            postId: postId,
            replyId: replyId,
            status_like: like,
            status_unlike: unlike,
        };

        if (!exists<Votes>(signer_addr)) { //create new
            if (isClickPost == true) { //click post
                assert!(postInfo.poster != signer_addr, ERROR_CANNOT_VOTE);

                if (like == true) {
                    postInfo.count_like = postInfo.count_like + 1;                
                };
                
                if (unlike == true) {
                    postInfo.count_unlike = postInfo.count_unlike + 1;
                };
            } else { //click reply
                let replyInfo = vector::borrow_mut(&mut postInfo.replies, replyId);

                assert!(replyInfo.replyer != signer_addr, ERROR_CANNOT_VOTE);

                if (like == true) {
                    replyInfo.count_like = replyInfo.count_like + 1;                
                };
                
                if (unlike == true) {
                    replyInfo.count_unlike = replyInfo.count_unlike + 1;
                };
            };


            let votes = Votes {
                votes: vector::empty<Vote>(),
            };

            vector::push_back(&mut votes.votes, voteInfo);

            move_to(sender, votes);
        } else {
            let votes = borrow_global_mut<Votes>(signer_addr);

            let i = 0;
            let idx = MAX_U64;
            let max_len = vector::length(&votes.votes);
            while (i < max_len) {
                let userVoteInfo = vector::borrow_mut(&mut votes.votes, i);
                if (userVoteInfo.postId == postId && userVoteInfo.replyId == replyId) {
                    if (userVoteInfo.isClickPost == isClickPost) {
                        idx = i;
                        break;
                    };
                };

                i = i + 1;
            };

            if (idx > max_len) { //add
                if (isClickPost == true) { //click post
                    assert!(postInfo.poster != signer_addr, ERROR_CANNOT_VOTE);

                    if (like == true) {
                        postInfo.count_like = postInfo.count_like + 1;                
                    };
                    
                    if (unlike == true) {
                        postInfo.count_unlike = postInfo.count_unlike + 1;
                    };
                } else { //click reply
                    let replyInfo = vector::borrow_mut(&mut postInfo.replies, replyId);
                    assert!(replyInfo.replyer != signer_addr, ERROR_CANNOT_VOTE);

                    if (like == true) {
                        replyInfo.count_like = replyInfo.count_like + 1;                
                    };
                    
                    if (unlike == true) {
                        replyInfo.count_unlike = replyInfo.count_unlike + 1;
                    };
                };
                
                vector::push_back(&mut votes.votes, voteInfo);

                return;
            };

            let userVoteInfo = vector::borrow_mut(&mut votes.votes, idx);

            if (isClickPost == true) { //click post
                assert!(postInfo.poster != signer_addr, ERROR_CANNOT_VOTE);

                if (like == true) {
                    if (userVoteInfo.status_like == true) {
                        userVoteInfo.status_like = false;
                        postInfo.count_like = postInfo.count_like - 1;                
                    } else {
                        userVoteInfo.status_like = true;
                        postInfo.count_like = postInfo.count_like + 1;

                        if (userVoteInfo.status_unlike == true) {
                            userVoteInfo.status_unlike = false;
                            postInfo.count_unlike = postInfo.count_unlike - 1;
                        };             
                    };
                };
                
                if (unlike == true) {
                    if (userVoteInfo.status_unlike == true) {
                        userVoteInfo.status_unlike = false;
                        postInfo.count_unlike = postInfo.count_unlike - 1;                
                    } else {
                        userVoteInfo.status_unlike = true;
                        postInfo.count_unlike = postInfo.count_unlike + 1;                

                        if (userVoteInfo.status_like == true) {
                            userVoteInfo.status_like = false;
                            postInfo.count_like = postInfo.count_like - 1;
                        };
                    };
                };
            } else { //click reply
                let replyInfo = vector::borrow_mut(&mut postInfo.replies, replyId);
                assert!(replyInfo.replyer != signer_addr, ERROR_CANNOT_VOTE);
                
                if (like == true) {
                    if (userVoteInfo.status_like == true) {
                        userVoteInfo.status_like = false;
                        replyInfo.count_like = replyInfo.count_like - 1;                
                    } else {
                        userVoteInfo.status_like = true;
                        replyInfo.count_like = replyInfo.count_like + 1;

                        if (userVoteInfo.status_unlike == true) {
                            userVoteInfo.status_unlike = false;
                            replyInfo.count_unlike = replyInfo.count_unlike - 1;
                        };             
                    };
                };
                
                if (unlike == true) {
                    if (userVoteInfo.status_unlike == true) {
                        userVoteInfo.status_unlike = false;
                        replyInfo.count_unlike = replyInfo.count_unlike - 1;                
                    } else {
                        userVoteInfo.status_unlike = true;
                        replyInfo.count_unlike = replyInfo.count_unlike + 1;

                        if (userVoteInfo.status_like == true) {
                            userVoteInfo.status_like = false;
                            replyInfo.count_like = replyInfo.count_like - 1;
                        };             
                    };
                };
            };
        };
    }

    public entry fun reply(
        sender: &signer,
        index: u64,
        content: String,
    ) acquires ModuleData, Posts {
        
        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);


        //set position for wallet and position count
        let signer_addr = signer::address_of(sender);
        
        assert!(exists<Posts>(resource_account_addr), ERROR_NOT_EXIST);


        let posts = borrow_global_mut<Posts>(resource_account_addr);
        let postInfo = vector::borrow_mut(&mut posts.posts, index);

        assert!(postInfo.poster != signer_addr, ERROR_CANNOT_REPLY);

        let replyInfo = ReplyInfo {
            replyer: signer_addr,
            replyTime: timestamp::now_seconds(),

            count_like: 0,
            count_unlike: 0,

            content: content,
        };

        vector::push_back(&mut postInfo.replies, replyInfo);
    }

    public entry fun post(
        sender: &signer,
        title: String,
        content: String,
    ) acquires ModuleData, Posts {

        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);

        //set position for wallet and position count
        let signer_addr = signer::address_of(sender);

        if (!exists<Posts>(resource_account_addr)) {
            let postInfo = PostInfo {
                poster: signer_addr,
                postTime: timestamp::now_seconds(),

                count_like: 0,
                count_unlike: 0,

                title: title,
                content: content,

                replies: vector::empty<ReplyInfo>(),
            };

            let posts = Posts {
                posts: vector::empty<PostInfo>(),
            };

            vector::push_back(&mut posts.posts, postInfo);

            move_to(&resource_signer, posts);
        } else {
            let posts = borrow_global_mut<Posts>(resource_account_addr);

            let postInfo = PostInfo {
                poster: signer_addr,
                postTime: timestamp::now_seconds(),

                count_like: 0,
                count_unlike: 0,

                title: title,
                content: content,

                replies: vector::empty<ReplyInfo>(),
            };

            vector::push_back(&mut posts.posts, postInfo);
        };
    }
}
