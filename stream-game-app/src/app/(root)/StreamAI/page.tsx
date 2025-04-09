import React from 'react';
import Image from 'next/image'; // 确保正确导入 next/image

export default function Home() {
  return (
    <div>
      <h1 className="text-white">StreamAI</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Image
        src="/StreamAI.png"
        alt="StreamAI Logo"
        width={100} // 提供宽度
        height={100} // 提供高度，auto 表示自动计算高度
        style={{ objectFit: 'contain' }} // 确保图片按比例缩放
      />
      </div>
      
    </div>
  );
}
