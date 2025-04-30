"use client"
import React from 'react';

interface GameCardProps {
    game: {
        id: number;
        face_img: string;
        title: string;
        style: string;
        release_date: string;
    };
    onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
    return (
        <div 
            className='bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105'
            onClick={onClick}
        >
            <img 
                src={game.face_img} 
                alt={game.title}
                className='w-full h-48 object-cover'
            />
            <div className='p-4'>
                <h3 className='text-xl font-bold'>{game.title}</h3>
                <p className='text-gray-300'>
                    {game.style.split("，").join(', ')} • {game.release_date}
                </p>
            </div>
        </div>
    );
};

export default GameCard;