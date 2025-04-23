"use client"; // 声明这是一个客户端组件（Next.js 13+特性）

import React, { useState } from 'react'; // 导入React和useState钩子
import Image from 'next/image'; // 导入Next.js优化过的Image组件

export default function Home() {
  // 使用useState创建状态变量inputValue和更新函数setInputValue
  const [inputValue, setInputValue] = useState('');

  /**
   * 处理输入框变化的回调函数
   * @param event React的输入变更事件对象
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 更新状态为输入框的当前值
    setInputValue(event.target.value);
  };

  /**
   * 处理表单提交的回调函数
   * @param event React的表单提交事件对象
   */
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 阻止表单默认提交行为（页面刷新）
    alert(`You entered: ${inputValue}`); // 弹出显示输入内容
  };

  return (
    // 主容器：使用flex布局使内容垂直居中
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', // 至少占满整个视口高度
      position: 'relative' // 作为子元素绝对定位的参照
    }}>
      {/* 页面标题 
      <h1 className="text-white">StreamAI</h1> */}
      
      {/* 图标*/}
      <div style={{ 
        position: 'absolute',
        top: '0px',       // 距离顶部
        left: '50%',        // 水平居中开始位置
        transform: 'translateX(-50%)', // 精确水平居中
        textAlign: 'center',
        zIndex: 1
      }}> 
        {/* Next.js优化图片组件 */}
        <Image
          src="/StreamAI.png" // 图片路径（存放在public目录）
          alt="StreamAI Logo" // 无障碍文本
          width={70} // 显示宽度
          height={70} // 显示高度
          style={{
            objectFit: 'contain' // 保持图片比例
          }}
        />
      </div>

      {/* 表单容器：定位在页面中间偏下位置 */}
      <div style={{
        position: 'absolute',
        top: '70%', // 从顶部70%位置开始
        transform: 'translateY(-50%)', // 向上移动自身高度的50%实现精确居中
        width: '100%', // 占满父容器宽度
        maxWidth: '500px', // 最大宽度限制
        textAlign: 'center' // 内容居中
      }}>
        {/* 表单元素，提交时触发handleFormSubmit */}
        <form onSubmit={handleFormSubmit}>
          {/* 输入框标签 */}
          <label htmlFor="textInput" style={{ 
            color: 'blue',
            display: 'block', // 使标签独占一行
            marginBottom: '8px', // 下边距
            fontSize: '18px' // 字体大小
          }}>
            Enter some text:
          </label>
          
          {/* 文本输入框 */}
          <input
            type="text"
            id="textInput" // 与label的htmlFor关联
            value={inputValue} // 绑定状态值
            onChange={handleInputChange} // 变更事件处理
            style={{
              border: '2px solid blue', // 边框样式
              backgroundColor: '#f0f8ff', // 浅蓝色背景
              color: 'blue', // 文字颜色
              padding: '12px', // 内边距
              borderRadius: '6px', // 圆角边框
              marginBottom: '16px', // 下边距
              width: '100%', // 占满容器宽度
              fontSize: '16px' // 字体大小
            }}
          />
          
          {/* 提交按钮 */}
          <button 
            type="submit" // 按钮类型为提交
            style={{ 
              backgroundColor: 'blue', 
              color: 'white', 
              padding: '12px 24px', // 上下12px，左右24px
              borderRadius: '6px',
              border: 'none', // 去除默认边框
              cursor: 'pointer', // 鼠标悬停变为手型
              fontSize: '16px',
              width: '100%' // 占满容器宽度
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}