"use client";
import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import useUserStore from "@/lib/useUserStore";

interface FavoriteComponentProps {
    g_id: number;
}

const FavoriteComponent: React.FC<FavoriteComponentProps> = ({ g_id }) => {
    const { user } = useUserStore();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadFavorite = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('collections')
                .select('g_ids')
                .eq('u_id', user.u_id)
                .single();
            if (data) {
                const gIds = data.g_ids.split('---').filter(Boolean);
                setIsFavorite(gIds.includes(String(g_id)));
            }
        };
        loadFavorite();
    }, [user, g_id]);

    const handleFavorite = async () => {
        if (!user) {
            alert('请先登录');
            return;
        }
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);

        const { data, error } = await supabase
            .from('collections')
            .select('g_ids')
            .eq('u_id', user.u_id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching collection:', error);
            setIsFavorite(!newFavoriteStatus);
            return;
        }

        let gIds: string[] = [];
        if (data) {

            gIds = data.g_ids ? data.g_ids.split('---').filter(Boolean) : [];
        }

        if (newFavoriteStatus) {
            if (!gIds.includes(String(g_id))) {
                gIds.push(String(g_id));
            }
        } else {
            gIds = gIds.filter((id: string) => id !== String(g_id));
        }

        const updatedGIds = gIds.join('---') + '---';

        if (!data) {
            const { error: insertError } = await supabase
                .from('collections')
                .insert({ u_id: user.u_id, g_ids: updatedGIds });
            if (insertError) {
                console.error('Error creating collection:', insertError);
                setIsFavorite(!newFavoriteStatus);
                return;
            }
        } else {
            const { error: updateError } = await supabase
                .from('collections')
                .upsert({ u_id: user.u_id, g_ids: updatedGIds });
            if (updateError) {
                console.error('Error updating collection:', updateError);
                setIsFavorite(!newFavoriteStatus);
                return;
            }
        }
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isFavorite ? 'red' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 cursor-pointer"
            onClick={handleFavorite}
            style={{ width: '24px', height: '24px' }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
        </svg>
    );
};

export default FavoriteComponent;