import React from 'react';
import Node from '../../components/Node';

const steps = [
  { id: 'step-1', type: 'trigger' },
  {
    id: 'branch-1',
    type: 'branch', // 这是一个特殊的分支节点
    // 它的内部嵌套了两个独立的子数组（左分支和右分支）
    paths: [
      [{ id: 'step-2a', type: 'action' }], // 左边
      [{ id: 'step-2b', type: 'action' }], // 右边
    ],
  },
  { id: 'step-3', type: 'action' },
];
export default function Canvas() {
  return (
    <div className="flex flex-col h-full items-center pt-20">
      {steps.map((step, index) => {
        if (step.type === 'branch') {
          return (
            <React.Fragment>
              {/* bianch node */}
              <Node type={step.type} />
              <div className='flex'>
                {/* 四条分支画三个方框 */}
                <div className='w-50 h-40 border'></div>
                <div className='w-50 h-40 border'></div>
                <div className='w-50 h-40 border'></div>
              </div>
            </React.Fragment>
          );
        } else {
          //没有分支的普通节点
          return (
            <React.Fragment key={step.id}>
              {/* action or trigger node*/}
              <Node type={step.type} />
              <div className="flex flex-col items-center">
                {/* 上半段虚线 */}
                <div className="w-0 h-6 border-l-2 border-dashed border-gray-300"></div>

                {/* 中间的圆形加号按钮 (Hover时变色，非常契合真实的拖拽手感) */}
                <button className="w-6 h-6 rounded-full bg-white border border-blue-500 text-blue-500 flex items-center justify-center -my-2 z-10 text-sm hover:bg-blue-50 transition-colors cursor-pointer">
                  +
                </button>

                {/* 下半段虚线 */}
                <div className="w-0 h-6 border-l-2 border-dashed border-gray-300"></div>
              </div>
            </React.Fragment>
          );
        }
      })}
    </div>
  );
}
