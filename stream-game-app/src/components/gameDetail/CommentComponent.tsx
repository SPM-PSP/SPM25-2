"use client";
import React, { useState, useEffect, useCallback } from 'react';
import  supabase  from '@/lib/supabase';
import useUserStore from "@/lib/useUserStore";

interface Comment {
    u_id: string;
    g_id: number;
    u_name: string;
    comment: string;
    time: string;
    simplified_time: string;
}

interface CommentComponentProps {
    g_id: number;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ g_id }) => {
    const { user } = useUserStore();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);

    // Load comments from Supabase
    const loadComments = useCallback(async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("g_id", g_id);
        if (error) {
            console.error('Error loading comments:', error);
            return;
        }
        setComments(data || []);
    }, [g_id]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    // Handle comment input change
    const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }, []);

    // Handle comment submission
    const handleCommentSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('请先登录');
            return;
        }
        if (comment.trim() === '') {
            alert('评论不能为空');
            return;
        }

        const currentTime = new Date();
        const localTime = currentTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        const date = new Date(localTime);
        const simplified_time = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

        const { error } = await supabase
            .from("comments")
            .insert({
                u_id: user.u_id,
                g_id,
                u_name: user.name,
                comment,
                time: localTime,
                simplified_time
            });

        if (error) {
            console.error('Error submitting comment:', error);
            alert('提交评论失败');
            return;
        }

        setComments(prev => [...prev, {
            u_id: user.u_id,
            g_id,
            u_name: user.name,
            comment,
            time: localTime,
            simplified_time
        }]);
        setComment('');
    }, [comment, user, g_id]);

    // Handle Enter key to submit comment
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit(e);
        }
    };

    return (
        <div className="comment-section">
            <h3 className="comment-title">发表评论</h3>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    className="comment-input"
                    rows={4}
                    placeholder="写下你的评论..."
                    value={comment}
                    onChange={handleCommentChange}
                    onKeyDown={handleKeyDown}
                />
                <button type="submit" className="comment-submit">发布</button>
            </form>
            <div className="comment-list">
                <h3 className="comment-list-title">评论</h3>
                {comments.length === 0 ? (
                    <p className="no-comments">暂无评论</p>
                ) : (
                    <ul>
                        {comments.map((c, index) => (
                            <li key={index} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-user">{c.u_name}</span>
                                    <span className="comment-time">{c.simplified_time}</span>
                                </div>
                                <p className="comment-content">{c.comment}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CommentComponent;