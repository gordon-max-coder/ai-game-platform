# 🤖 智能模型路由系统 - 数据收集框架

## 📊 需要的数据维度

### 1️⃣ 游戏复杂度数据（输入侧）

#### 1.1 游戏类型分类
```json
{
  "simple": {
    "types": ["贪食蛇", "打砖块", "Ping Pong", "井字棋"],
    "features": ["单一玩法", "无物理引擎", "简单碰撞"],
    "estimated_tokens": 1500-2500,
    "recommended_model": "deepseek-coder"
  },
  "medium": {
    "types": ["平台跳跃", "射击游戏", "赛车", "塔防"],
    "features": ["多关卡", "简单物理", "多种敌人"],
    "estimated_tokens": 2500-4000,
    "recommended_model": "claude-sonnet-3-5"
  },
  "complex": {
    "types": ["RPG", "物理模拟", "多人游戏", "AI 对战"],
    "features": ["复杂状态机", "物理引擎", "多系统"],
    "estimated_tokens": 4000-8000+,
    "recommended_model": "claude-opus-4-6"
  }
}
```

#### 1.2 提示词特征分析
```javascript
const promptFeatures = {
  // 基础指标
  length: 0,           // 提示词长度（字符数）
  wordCount: 0,        // 单词数
  sentenceCount: 0,    // 句子数
  
  // 关键词分析
  keywords: {
    simple: ['贪食蛇', '打砖块', '简单'],
    medium: ['平台', '射击', '关卡', '敌人'],
    complex: ['RPG', '物理引擎', '多人', 'AI', '复杂']
  },
  
  // 功能需求
  requiredFeatures: {
    physics: false,        // 需要物理引擎
    ai: false,            // 需要 AI
    multiplayer: false,   // 需要多人
    saveSystem: false,    // 需要保存系统
    audio: false,         // 需要音效
    particles: false,     // 需要粒子效果
    levels: 0,           // 关卡数量
    enemies: 0,          // 敌人类型数
    powerups: 0          // 道具数量
  },
  
  // 复杂度评分
  complexityScore: 0      // 0-100 分
};
```

---

### 2️⃣ 模型性能数据（输出侧）

#### 2.1 成本数据
```javascript
const modelCosts = {
  'deepseek-coder': {
    input: 0.14,      // $/百万 tokens
    output: 0.14,
    avgGameCost: 0.0005  // 平均每个游戏成本
  },
  'claude-sonnet-3-5': {
    input: 3,
    output: 15,
    avgGameCost: 0.03
  },
  'claude-opus-4-6': {
    input: 15,
    output: 75,
    avgGameCost: 0.15
  },
  'llama-4-maverick': {
    input: ?,         // 需要收集
    output: ?,
    avgGameCost: ?
  }
};
```

#### 2.2 速度数据
```javascript
const modelSpeed = {
  'deepseek-coder': {
    avgResponseTime: 3000,    // 毫秒
    p95ResponseTime: 5000,
    tokensPerSecond: 100
  },
  'claude-sonnet-3-5': {
    avgResponseTime: 4000,
    p95ResponseTime: 7000,
    tokensPerSecond: 80
  },
  'claude-opus-4-6': {
    avgResponseTime: 12000,
    p95ResponseTime: 20000,
    tokensPerSecond: 50
  }
};
```

#### 2.3 质量评分（需要自动评估）
```javascript
const qualityMetrics = {
  'model-name': {
    // 代码质量
    codeCompleteness: 0.95,    // 代码完整性 0-1
    syntaxCorrectness: 0.98,   // 语法正确率
    structureClarity: 0.90,    // 结构清晰度
    
    // 游戏质量
    gamePlayable: 0.95,        // 可玩性
    controlsSmooth: 0.90,      // 控制流畅度
    rulesCorrect: 0.95,        // 规则正确性
    
    // 视觉效果
    visualAppeal: 0.85,        // 视觉吸引力
    animationsSmooth: 0.80,    // 动画流畅度
    
    // 综合评分
    overallScore: 0.90,        // 综合评分
    
    // 按游戏类型细分
    byGameType: {
      'simple': { score: 0.95, successRate: 0.98 },
      'medium': { score: 0.90, successRate: 0.95 },
      'complex': { score: 0.85, successRate: 0.90 }
    }
  }
};
```

---

### 3️⃣ 用户反馈数据

#### 3.1 显式反馈
```javascript
const userFeedback = {
  gameId: 'xxx',
  model: 'claude-sonnet-3-5',
  gameType: 'platformer',
  ratings: {
    quality: 4,        // 1-5 星
    speed: 5,
    costPerformance: 5
  },
  issues: [
    'collision_bug',
    'missing_feature'
  ],
  wouldRecommend: true
};
```

#### 3.2 隐式反馈
```javascript
const implicitSignals = {
  gameId: 'xxx',
  model: 'claude-sonnet-3-5',
  
  // 用户行为
  timeToFirstPlay: 5000,    // 生成后多久开始玩（毫秒）
  playDuration: 120000,     // 玩了多久
  modifiedGame: false,      // 是否修改了游戏
  downloadedCode: true,     // 是否下载了代码
  sharedGame: false,        // 是否分享
  
  // 满意度推断
  satisfaction: 'high'      // high/medium/low
};
```

---

### 4️⃣ 历史使用数据

#### 4.1 请求日志
```javascript
const requestLog = {
  timestamp: '2025-01-XX 10:30:00',
  prompt: '创建一个贪食蛇游戏...',
  promptLength: 150,
  model: 'claude-sonnet-3-5',
  modelChoice: 'auto',      // auto/manual
  
  // 结果
  success: true,
  responseTime: 4200,
  inputTokens: 200,
  outputTokens: 2800,
  totalTokens: 3000,
  cost: 0.045,
  
  // 质量
  gameType: 'simple',
  complexityScore: 25,
  userRating: 5,
  issues: []
};
```

#### 4.2 统计聚合
```javascript
const dailyStats = {
  date: '2025-01-XX',
  
  byModel: {
    'deepseek-coder': {
      requests: 150,
      successRate: 0.98,
      avgCost: 0.0005,
      avgResponseTime: 3000,
      avgRating: 4.5,
      totalCost: 0.075
    },
    'claude-sonnet-3-5': {
      requests: 80,
      successRate: 0.96,
      avgCost: 0.03,
      avgResponseTime: 4000,
      avgRating: 4.7,
      totalCost: 2.4
    }
  },
  
  byGameType: {
    'simple': { count: 150, avgCost: 0.0005, preferredModel: 'deepseek' },
    'medium': { count: 80, avgCost: 0.03, preferredModel: 'sonnet' },
    'complex': { count: 20, avgCost: 0.15, preferredModel: 'opus' }
  },
  
  totalCost: 5.475,
  totalRequests: 250
};
```

---

### 5️⃣ 路由规则配置

#### 5.1 规则引擎
```javascript
const routingRules = {
  // 规则 1: 基于游戏类型
  rules: [
    {
      id: 'simple-games',
      condition: {
        gameType: ['snake', 'breaker', 'pong'],
        OR: {
          complexityScore: { lt: 30 },
          promptLength: { lt: 100 }
        }
      },
      action: {
        model: 'deepseek-coder',
        reason: 'Simple game, cost optimization'
      }
    },
    {
      id: 'medium-games',
      condition: {
        OR: [
          { gameType: ['platformer', 'shooter'] },
          { complexityScore: { gte: 30, lt: 60 } }
        ]
      },
      action: {
        model: 'claude-sonnet-3-5',
        reason: 'Medium complexity, balance cost and quality'
      }
    },
    {
      id: 'complex-games',
      condition: {
        OR: [
          { gameType: ['rpg', 'physics', 'multiplayer'] },
          { complexityScore: { gte: 60 } },
          { requiredFeatures: { physics: true, ai: true } }
        ]
      },
      action: {
        model: 'claude-opus-4-6',
        reason: 'Complex game, quality priority'
      }
    }
  ],
  
  // 默认规则
  default: {
    model: 'claude-sonnet-3-5',
    reason: 'Default balanced choice'
  },
  
  // 约束条件
  constraints: {
    maxDailyBudget: 10,           // 每日预算上限
    maxCostPerGame: 0.50,         // 单游戏成本上限
    maxResponseTime: 30000,       // 最大响应时间（毫秒）
    minQualityScore: 0.80         // 最低质量评分
  }
};
```

---

## 📋 数据收集清单

### 阶段 1: 基础数据（立即开始）

#### A. 每次请求时收集
- [ ] 提示词原文
- [ ] 提示词长度
- [ ] 使用的模型
- [ ] 模型选择方式（自动/手动）
- [ ] 响应时间
- [ ] 输入/输出 tokens
- [ ] 实际成本
- [ ] 成功/失败状态

#### B. 游戏生成后收集
- [ ] 游戏类型（自动分类）
- [ ] 复杂度评分（算法计算）
- [ ] 代码行数
- [ ] 功能点数量
- [ ] 是否可运行（自动测试）

#### C. 用户交互时收集
- [ ] 是否开始游戏
- [ ] 游戏时长
- [ ] 是否修改
- [ ] 是否下载
- [ ] 是否分享
- [ ] 显式评分（1-5 星）

---

### 阶段 2: 质量评估（1-2 周）

#### A. 自动代码质量分析
```javascript
function analyzeCodeQuality(code) {
  return {
    hasHTML: code.includes('<!DOCTYPE html>'),
    hasCanvas: code.includes('<canvas'),
    hasGameLoop: code.includes('requestAnimationFrame') || 
                 code.includes('setInterval') ||
                 code.includes('gameLoop'),
    hasCollision: code.includes('collision') || 
                  code.includes('intersect'),
    hasScore: code.includes('score') || code.includes('points'),
    hasControls: code.includes('keydown') || 
                 code.includes('touchstart'),
    
    // 代码结构
    functionCount: (code.match(/function\s+\w+/g) || []).length,
    classCount: (code.match(/class\s+\w+/g) || []).length,
    
    // 潜在问题
    syntaxErrors: checkSyntax(code),
    missingElements: checkRequiredElements(code)
  };
}
```

#### B. 自动游戏可玩性测试
```javascript
function testGamePlayability(gameCode) {
  // 在 headless 浏览器中运行
  // 检查是否能启动
  // 检查控制是否响应
  // 检查游戏循环是否运行
  // 检查是否有明显 bug
}
```

---

### 阶段 3: 模型对比测试（2-4 周）

#### A. A/B 测试设计
```javascript
const abTests = [
  {
    name: 'simple-game-model-test',
    variants: ['deepseek-coder', 'claude-sonnet-3-5'],
    gameTypes: ['snake', 'breaker'],
    metric: 'costPerformance',
    duration: 7  // days
  },
  {
    name: 'complex-game-model-test',
    variants: ['claude-sonnet-3-5', 'claude-opus-4-6'],
    gameTypes: ['rpg', 'platformer'],
    metric: 'quality',
    duration: 14
  }
];
```

#### B. 质量评分系统
```javascript
const qualityScoring = {
  weights: {
    codeCompleteness: 0.30,
    gamePlayable: 0.30,
    controlsSmooth: 0.15,
    visualAppeal: 0.15,
    performance: 0.10
  },
  
  calculate: function(metrics) {
    let score = 0;
    for (const [key, weight] of Object.entries(this.weights)) {
      score += metrics[key] * weight;
    }
    return score;
  }
};
```

---

## 🛠️ 实施方案

### Step 1: 数据收集层（本周）

创建 `analytics-collector.js`:
```javascript
class AnalyticsCollector {
  constructor() {
    this.logs = [];
  }
  
  // 记录请求
  logRequest(data) {
    this.logs.push({
      timestamp: new Date(),
      type: 'request',
      ...data
    });
  }
  
  // 记录结果
  logResult(data) {
    this.logs.push({
      timestamp: new Date(),
      type: 'result',
      ...data
    });
  }
  
  // 记录用户行为
  logUserAction(data) {
    this.logs.push({
      timestamp: new Date(),
      type: 'user_action',
      ...data
    });
  }
  
  // 保存到文件
  saveToFile() {
    const filename = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.logs, null, 2));
  }
}
```

### Step 2: 分析层（下周）

创建 `model-analyzer.js`:
```javascript
class ModelAnalyzer {
  constructor() {
    this.modelStats = {};
  }
  
  // 计算模型性能
  calculateModelPerformance(modelName) {
    const logs = this.getLogsForModel(modelName);
    
    return {
      avgResponseTime: this.average(logs, 'responseTime'),
      successRate: this.successRate(logs),
      avgCost: this.average(logs, 'cost'),
      avgRating: this.average(logs, 'userRating'),
      qualityScore: this.calculateQualityScore(logs)
    };
  }
  
  // 按游戏类型分析
  analyzeByGameType(modelName, gameType) {
    const logs = this.getLogsForModelAndType(modelName, gameType);
    return this.calculateModelPerformance(modelName, logs);
  }
}
```

### Step 3: 路由层（2 周后）

创建 `model-router.js`:
```javascript
class ModelRouter {
  constructor() {
    this.rules = loadRoutingRules();
    this.analyzer = new ModelAnalyzer();
  }
  
  // 选择最佳模型
  selectModel(prompt, options = {}) {
    const complexity = this.analyzeComplexity(prompt);
    const gameType = this.detectGameType(prompt);
    
    // 应用规则
    const rule = this.matchRule({ complexity, gameType, ...options });
    
    // 检查约束
    if (!this.checkConstraints(rule.model)) {
      return this.findAlternative(rule.model);
    }
    
    return {
      model: rule.model,
      reason: rule.reason,
      confidence: rule.confidence
    };
  }
  
  // 分析复杂度
  analyzeComplexity(prompt) {
    let score = 0;
    
    // 长度评分
    score += Math.min(prompt.length / 10, 30);
    
    // 关键词评分
    const complexKeywords = ['RPG', '物理', '多人', 'AI'];
    complexKeywords.forEach(k => {
      if (prompt.includes(k)) score += 15;
    });
    
    // 功能需求评分
    const features = ['物理引擎', '保存系统', '音效', '粒子'];
    features.forEach(f => {
      if (prompt.includes(f)) score += 10;
    });
    
    return Math.min(score, 100);
  }
  
  // 检测游戏类型
  detectGameType(prompt) {
    const simpleGames = ['贪食蛇', '打砖块', 'ping pong'];
    const mediumGames = ['平台', '射击', '赛车'];
    const complexGames = ['RPG', '物理', '多人'];
    
    if (simpleGames.some(g => prompt.includes(g))) return 'simple';
    if (mediumGames.some(g => prompt.includes(g))) return 'medium';
    if (complexGames.some(g => prompt.includes(g))) return 'complex';
    
    return 'medium'; // 默认
  }
}
```

---

## 📊 数据收集优先级

| 优先级 | 数据 | 用途 | 收集难度 |
|--------|------|------|----------|
| **P0** | 提示词、模型、响应时间、tokens | 基础分析 | ⭐ 简单 |
| **P0** | 成本、成功/失败 | 成本优化 | ⭐ 简单 |
| **P1** | 游戏类型、复杂度评分 | 路由决策 | ⭐⭐ 中等 |
| **P1** | 用户行为（播放、下载） | 质量推断 | ⭐⭐ 中等 |
| **P2** | 自动代码质量分析 | 质量评估 | ⭐⭐⭐ 复杂 |
| **P2** | 自动游戏测试 | 可玩性验证 | ⭐⭐⭐ 复杂 |
| **P3** | A/B 测试框架 | 模型对比 | ⭐⭐⭐⭐ 很复杂 |

---

## 🎯 预期收益

### 成本优化
```
当前（全部 Sonnet）: $96/月 (100 games/day)

优化后:
- 70% 简单游戏 → DeepSeek: $0.035/day
- 25% 中等游戏 → Sonnet: $0.75/day
- 5%  复杂游戏 → Opus: $1.25/day

总计：$2.04/day → $61/月
节省：36% → $35/月
```

### 质量提升
```
当前（单一模型）: 
- 简单游戏：质量过剩
- 复杂游戏：可能不足

优化后（智能路由）:
- 简单游戏：合适模型 + 快速响应
- 复杂游戏：最佳模型 + 高质量
```

---

## ✅ 立即行动清单

- [ ] **今天**: 开始收集基础数据（P0）
- [ ] **本周**: 实现游戏类型自动分类
- [ ] **下周**: 添加用户行为追踪
- [ ] **2 周**: 实现自动代码质量分析
- [ ] **3 周**: 开发路由规则引擎
- [ ] **4 周**: A/B 测试不同路由策略

---

**需要我帮你实现哪个部分？我建议从 P0 数据收集开始！** 📊
