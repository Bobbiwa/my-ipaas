import React, { useState } from 'react';

// ==========================================
// 1. TypeScript 类型定义
// ==========================================
export type NodeType = 'trigger' | 'action' | 'branch';

export interface BaseStep {
  id: string;
  label: string;
  type: NodeType;
}

export interface ActionStep extends BaseStep {
  type: 'trigger' | 'action';
}

export interface BranchStep extends BaseStep {
  type: 'branch';
  paths: Step[][];
}

export type Step = ActionStep | BranchStep;

// ==========================================
// 2. 初始 Mock 数据与样式
// ==========================================
const nodeStyle =
  'w-28 h-28 bg-blue-600 rounded-lg flex items-center justify-center text-white text-base font-medium shadow-md shrink-0';

const initialStepsData: Step[] = [
  { id: 'step-1', label: 'trigger', type: 'trigger' },
  {
    id: 'branch-1',
    label: 'branch',
    type: 'branch',
    paths: [
      [
        { id: 'step-2a-1', label: 'action', type: 'action' },
        { id: 'step-2a-2', label: 'action', type: 'action' },
      ],
      [
        { id: 'step-2b-1', label: 'action', type: 'action' },
        {
          id: 'branch-1',
          label: 'branch',
          type: 'branch',
          paths: [
            [
              { id: 'step-2a-1', label: 'action', type: 'action' },
              { id: 'step-2a-2', label: 'action', type: 'action' },
            ],
            [{ id: 'step-2b-1', label: 'action', type: 'action' }],
            [{ id: 'step-2b-1', label: 'action', type: 'action' }],
            // 测试极限场景：如果在数据里加一个空分支，它也能完美渲染出一个加号！
            // []
          ],
        },
      ],
      [{ id: 'step-2b-1', label: 'action', type: 'action' }],
      // 测试极限场景：如果在数据里加一个空分支，它也能完美渲染出一个加号！
      // []
    ],
  },
  { id: 'step-3', label: 'action', type: 'action' },
];

// ==========================================
// 3. 抽离出的独立加号组件 (为接下来的点击事件做准备)
// ==========================================
function AddButtonDivider() {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="w-0 h-6 border-l-2 border-dashed border-gray-400"></div>
      <button className="w-6 h-6 rounded-full bg-white border border-blue-600 text-blue-600 flex items-center justify-center -my-2 z-10 hover:bg-blue-50 transition-colors cursor-pointer shrink-0 shadow-sm">
        +
      </button>
      <div className="w-0 h-6 border-l-2 border-dashed border-gray-400"></div>
    </div>
  );
}

// ==========================================
// 4. 核心递归渲染组件
// ==========================================
// 增加了一个 isBranchPath 属性，用来判断当前是不是在渲染分支内部的线路
function FlowList({
  list,
  isBranchPath = false,
}: {
  list: Step[];
  isBranchPath?: boolean;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 【核心逻辑 1】：只要进入了分支线路，先在最顶端画一个加号！ */}
      {/* 这样就能保证分支内的第一个 Action 上方有加号，且空分支也能点加号 */}
      {isBranchPath && <AddButtonDivider />}

      {list.map((step) => {
        // 场景 A：分支控制节点
        if (step.type === 'branch') {
          return (
            <React.Fragment key={step.id}>
              <div className={nodeStyle}>{step.label}</div>

              {/* 分支节点和分叉线之间的连接线（这里不放加号，因为这是整体结构） */}
              <div className="w-0 h-6 border-l-2 border-dashed border-gray-400 shrink-0"></div>

              {/* 橫向展开所有的分支线路 */}
              <div className="flex flex-row items-stretch justify-center relative w-full">
                {step.paths.map((pathSteps, branchIndex) => {
                  const isFirstBranch = branchIndex === 0;
                  const isLastBranch = branchIndex === step.paths.length - 1;

                  return (
                    <div
                      key={branchIndex}
                      className="flex flex-col items-center relative px-8 min-w-[150px]"
                    >
                      {/* 顶部横向分叉线 */}
                      <div className="absolute top-0 left-0 right-0 h-0 flex">
                        <div
                          className={`flex-1 ${isFirstBranch ? '' : 'border-t-2 border-dashed border-gray-400'}`}
                        ></div>
                        <div
                          className={`flex-1 ${isLastBranch ? '' : 'border-t-2 border-dashed border-gray-400'}`}
                        ></div>
                      </div>

                      {/* 【核心递归】：渲染分支内的节点，并告诉它“你在分支里” */}
                      <FlowList list={pathSteps} isBranchPath={true} />

                      {/* 保底高度虚线（解决之前你发现的红圈紧贴 Bug） */}
                      <div className="w-0 h-4 shrink-0 border-l-2 border-dashed border-gray-400"></div>

                      {/* 弹性延展线：自动填补左右分支高度差 */}
                      <div className="w-0 flex-1 border-l-2 border-dashed border-gray-400"></div>

                      {/* 底部汇合横线 */}
                      <div className="absolute bottom-0 left-0 right-0 h-0 flex">
                        <div
                          className={`flex-1 ${isFirstBranch ? '' : 'border-b-2 border-dashed border-gray-400'}`}
                        ></div>
                        <div
                          className={`flex-1 ${isLastBranch ? '' : 'border-b-2 border-dashed border-gray-400'}`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 【核心逻辑 2】：分支区域合并结束后，强制跟一个加号 */}
              <AddButtonDivider />
            </React.Fragment>
          );
        }

        // 场景 B：普通动作节点
        return (
          <React.Fragment key={step.id}>
            <div className={nodeStyle}>{step.label}</div>
            {/* 【核心逻辑 3】：不再判断是不是最后一个，只要是普通节点，下面永远自带加号 */}
            <AddButtonDivider />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ==========================================
// 5. 主画布入口
// ==========================================
export default function Canvas() {
  const [steps, setSteps] = useState<Step[]>(initialStepsData);

  return (
    <div
      className="w-full h-full bg-[#f4f7fa] flex flex-col items-center pt-24 pb-48 overflow-auto"
      style={{
        backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <FlowList list={steps} />
    </div>
  );
}
