"use client";
import React, { useState, useEffect, useCallback } from 'react';
import  supabase  from '@/lib/supabase';
import useUserStore from "@/lib/useUserStore";

interface Comment {
    u_id: string;
    g_id: number;
    u_name: string;
    content: string;
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
        console.log('获取评论，游戏 ID:', g_id);
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("g_id", g_id);
        if (error) {
            console.error('获取评论失败:', error.message, error.details, error.hint);
            return;
        }
        console.log('已加载评论:', data);
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
        if (!user || !user.u_id) {
            alert('请先登录');
            return;
        }
        if (comment.trim() === '') {
            alert('评论不能为空');
            return;
        }

        const currentTime = new Date();
        const localTime = currentTime.toISOString();
        const simplified_time = currentTime.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        console.log('提交评论:', {
            u_id: user.u_id,
            g_id,
            u_name: user.u_name,
            content: comment,
            time: localTime,
            simplified_time
        });

        // Check if a comment already exists for this user and game
        const { data: existingComment, error: checkError } = await supabase
            .from("comments")
            .select("*")
            .eq("u_id", user.u_id)
            .eq("g_id", g_id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('检查评论失败:', checkError.message, checkError.details, checkError.hint);
            alert(`检查评论失败: ${checkError.message}`);
            return;
        }

        if (existingComment) {
            const { error: updateError } = await supabase
                .from("comments")
                .update({
                    content: comment,
                    time: localTime,
                    simplified_time
                })
                .eq("u_id", user.u_id)
                .eq("g_id", g_id);

            if (updateError) {
                console.error('更新评论失败:', updateError.message, updateError.details, updateError.hint);
                alert(`更新评论失败: ${updateError.message}`);
                return;
            }
            console.log('评论更新成功');
        } else {
            const { error: insertError } = await supabase
                .from("comments")
                .insert({
                    u_id: user.u_id,
                    g_id,
                    u_name: user.u_name,
                    content: comment,
                    time: localTime,
                    simplified_time
                });

            if (insertError) {
                console.error('提交评论失败:', insertError.message, insertError.details, insertError.hint);
                alert(`提交评论失败: ${insertError.message}`);
                return;
            }
            console.log('评论提交成功');
        }

        loadComments();
        setComment('');
    }, [comment, user, g_id, loadComments]);

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
                                <p className="comment-content">{c.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CommentComponent;