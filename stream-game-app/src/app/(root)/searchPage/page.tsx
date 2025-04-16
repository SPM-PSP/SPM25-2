import React from 'react';
import Head from 'next/head';
import './page.css';
import Link from 'next/link';

// 定义 Home 组件，用于展示游戏详情页面
const Home = () => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
            </Head>
            <div
                className="serchPage"
            >
                <div className="header">
                    <div className="stream">STREAM</div>
                    <div className="nav">
                        <Link href={'/leaderBoard'} className="div">排行榜</Link>
                        <Link href={'/StreamAI'}  className="stream-ai">Stream AI</Link>
                        <Link href={'/user'} className="div2" >账户管理</Link>
                        <Link href={'/dashboard'} className="div3" >游戏商城</Link>
                        <Link href={'/collections'} className="div4" >我的收藏</Link>
                    </div>
                    <div className="search">
                        <div className="div5">搜索</div>
                        <div className="frame-162">
                            <Link href="/login">
                                <img className="logout" src="/search/logout0.svg" alt="logout" />
                            </Link>
                        </div>
                    </div>
                    <div className="user">
                        <div className="sun">Sun</div>
                    </div>
                </div>
                <img className="rectangle-6" src="/search/rectangle-60.png" alt="rectangle 6" />
                <div className="rectangle-3"></div>
                <img className="rectangle-14" src="/search/rectangle-140.png" alt="rectangle 14" />
            </div>
        </>
    );
};

export default Home;