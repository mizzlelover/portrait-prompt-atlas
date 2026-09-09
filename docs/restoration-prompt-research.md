# 人像与老照片修复专项采集

> 这是一份“待筛选研究池”，不是已经通过版权审核的公开提示词库。原文只保留短摘录、结构摘要或来源线索；未经作者与许可核验的记录不会自动进入 `data/prompts.jsonl`。

## 本轮目标

本轮将检索范围从现有 X / GPT Image 2 语料扩大到 GitHub 开源仓库、模型工作流、中文教程、英文修复专题、Reddit、X 可索引页面、提示词目录、付费提示词线索和学术论文。目标不是继续堆叠“复古人像”或“高清美颜”，而是把真正的图像修复刚需拆出来：

- **严格修复**：去除划痕、折痕、灰尘、霉斑、污渍、褪色、偏色、轻度模糊，并尽量不改变原始人物。
- **人脸与身份保全**：锁定脸型、年龄、表情、发型、姿态、服装和构图，防止生成模型“修复成另一个人”。
- **严重损伤重建**：缺角、撕裂、缺失区域和模糊脸的保守推断；这类记录必须单独标记“推断”，不能与档案修复混称。
- **黑白上色**：保留为独立衍生方向。上色是历史上合理的解释版本，不是原始颜色的恢复。
- **低清与扫描救援**：去噪、去模糊、去压缩、去翻拍反光、放大；不能把摄影风格升级误写成老照片修复。

采集文件：[`data/restoration-prompt-research.jsonl`](../data/restoration-prompt-research.jsonl)。检索截止日：2026-09-09。

## 采集结果概览

当前研究池共 **52 条**：

| 类型 | 数量 | 处理方式 |
| --- | ---: | --- |
| 有短摘录或结构摘要的候选 prompt | 43 | 进入作者、许可、近重复和实图验证队列 |
| 仅来源线索 | 7 | 付费、社交账号或页面抓取不稳定，不复制正文 |
| 学术/方法论参考 | 2 | 只用于定义任务边界，不作为用户 prompt |

这 45 条不是 45 个独立方法。近重复主要集中在四个簇：

1. `identity-first-conservative`：身份锁定 + 去损伤 + 保留颗粒，数量最多。
2. `physical-damage-repair` / `severe-physical-damage`：划痕、折痕、撕裂、缺角、霉斑和水渍。
3. `black-white-colorization`：黑白上色、时代色彩、自然肤色；必须和严格修复分开。
4. `enhancement-not-restoration` / `modern-camera-enhancement`：8K、DSLR、iPhone、HDR 或皮肤增强，属于邻接能力，不应冒充老照片修复。

## 重要发现

### 1. 真正的修复 prompt 几乎都有同一组“硬约束”

高质量候选通常同时出现：

- 保持身份、年龄、表情、姿态、服装和构图；
- 只修复输入中能看见、能由周围证据支持的损伤；
- 保留胶片颗粒、纸张纹理、时代感和原始宽高比；
- 明确禁止磨皮、换脸、现代化、添加人物、发明文字和新背景；
- 对缺失区域使用“保守重建 / 不确定则保持中性”的措辞。

单独写“restore / enhance / upscale”而没有身份锁定与不发明约束的记录，不能直接进入严格修复库。

### 2. “老照片修复”至少要分成三条产品线

1. **档案保全修复**：黑白仍为黑白；修损伤、恢复对比度和可读细节。
2. **历史色彩衍生**：黑白或褪色照片的时代合理上色；保留原件，并在结果中标记为 colorized derivative。
3. **推断性重建**：缺脸、缺角、严重撕裂、极端低清；可以提供，但必须告知“生成模型推断了缺失信息”。

“变成现代 iPhone / DSLR / HDR 照片”的提示词另列为 `portrait_enhancement_adjacent`，不与修复混合。

### 3. 作者与版权不能从“发布者”直接推断

本轮按以下规则记录：

- GitHub 仓库维护者是发布者，只有明确自称原创或给出上游链接时才改变 `authorship_status`。
- 教程作者、Reddit 发帖人和 X 账号默认是 publisher，不自动变成 prompt author。
- 页面明确列出上游作者的，标记 `repost_creator_credited`，同时保留转载页面和原始链接。
- CC BY 4.0（ArTeo 页面列出的 Coffin 提示词）可以作为候选，但仍需按许可证署名。
- CC BY-NC 4.0（KeRo AI Prompt Library）只能作为非商业研究/展示参考，不能直接用于商业服务或商业再发布。
- 付费页面只保留线索，不复制正文。

## 优先候选与来源

以下链接是本轮最值得继续核验的来源；每条对应研究池中的 `id`，原文摘录已尽量压缩，避免把未授权长文本重新发布。

### GitHub / 可复核工作流

- [KeRo AI Prompt Library：老照片高保真修复](https://github.com/Youks7/AI-Prompt-Library/blob/main/prompts/08-banana-portrait-and-restoration.md)（`RPR-0001`、`RPR-0002`，CC BY-NC 4.0）
- [Starchild official image-edit skill](https://github.com/Starchild-ai-agent/official-skills/blob/main/image-edit/SKILL.md)（`RPR-0003`、`RPR-0004`）
- [TaiChiFlow nano-banana-pro-api](https://github.com/TaiChiFlow/nano-banana-pro-api)（`RPR-0005`）
- [Qwen Image Edit prompt utility](https://github.com/MozDevApps/Qwen-Image-Edit/blob/main/src/examples/tools/prompt_utils.py)（`RPR-0006`）
- [ComfyUI-Angelo](https://github.com/shootthesound/ComfyUI-Angelo)（`RPR-0007`、`RPR-0008`）

### 中文与英文教程 / 提示词目录

- [Mooko：8K 人像修复模板](https://www.mooko.cn/article/443)（`RPR-0009`、`RPR-0010`）
- [博客园：老照片修复与分场景模板](https://www.cnblogs.com/czha2002/p/20462901/old-photo-restoration)（`RPR-0011`–`RPR-0014`）
- [PromptTool：通用、黑白修复和严重损伤变体](https://www.prompttool.co/prompt-for-photo-restoration.php)（`RPR-0015`–`RPR-0017`）
- [Old Photo Restoration：ChatGPT / Gemini prompts](https://oldphotorestoration.org/blog/old-photo-restoration-prompts/)、[Gemini conservative prompt](https://oldphotorestoration.org/blog/gemini-old-photo-restoration-prompt/)（`RPR-0018`–`RPR-0020`、`RPR-0023`）
- [Nano AI Maker：8 类谨慎模板](https://nanoaimaker.com/blog/old-photo-restoration-prompt)（`RPR-0021`、`RPR-0022`）
- [SuperMaker：Gemini 老照片修复](https://supermaker.ai/blog/old-photo-restoration-prompt-gemini-best-copy-and-paste-prompts-to-restore-old-photos/)（`RPR-0024`）
- [Image-2.net：GPT Image 2 老照片修复](https://image-2.net/gpt-image-2-prompts/old-photo-restoration/)（`RPR-0025`）
- [Image Prompt Gallery：四人家庭照案例](https://imagepromptgallery.com/cases/vintage-family-photo-restoration-gpt-image-2)（`RPR-0026`）
- [ArTeo：Coffin 的 CC BY 4.0 提示词](https://arteo.studio/prompts/JYzVFh/old-photo-restoration-prompt)（`RPR-0027`）
- [TechRepublic：六步修复工作流](https://www.techrepublic.com/article/news-ai-prompts-restore-old-photos/)（`RPR-0029`）
- [Photo Editing Prompts：repair-only cards](https://photoeditingprompts.io/old-photo-restoration-prompt/)（`RPR-0030`）
- [Image to Prompt：保守自然修复](https://image-to-prompt.org/old-image-restoration-prompt)（`RPR-0031`）
- [Nova Express AI PDF](https://blog.novaexpress.ai/wp-content/uploads/2026/01/Photo-Restoration-and-Colorization-Prompt-1.pdf)（`RPR-0032`）
- [YouTube：Pakde Benyo 老照片修复](https://www.youtube.com/watch?v=MmD1WUV2BQo)（`RPR-0046`）

### 社区与社交来源

- [Reddit：Nano Banana old photo restoration](https://www.reddit.com/r/nanobanana/comments/1rqphly/tested_nano_banana_for_old_photo_restoration_12/)（`RPR-0033`、`RPR-0034`）
- [Reddit：Flux Kontext photo restoration](https://www.reddit.com/r/StableDiffusion/comments/1m26bsi/comfyui_basic_flux_kontext_photo_restoration/)（`RPR-0035`）
- [Reddit：OpenAI old photo prompt](https://www.reddit.com/r/OpenAI/comments/1u6wdkq/i_absolutely_love_ai/)（`RPR-0036`）
- [Reddit：Nano Banana Pro HDR restoration](https://www.reddit.com/r/nanobanana2pro/comments/1rl6pbw/free_hdr_quality_photo_restoration_using_nano/)（`RPR-0037`）
- [X：Ascendant Stoic](https://x.com/Ascendant_Stoic/status/2017132523663323577)（`RPR-0038`）
- [X：Shreya Yadav](https://x.com/Shreyayadav/status/2013108344404509163)（`RPR-0039`，标记为 enhancement 邻接）
- [X：@nerdyx90 转发线索](https://x.com/nerdyx90/status/2043574951085752367)（`RPR-0049`）
- [X：@Kaylerris 老照片修复账号](https://x.com/Kaylerris/with_replies)（`RPR-0050`）
- [Reddit：Gemini 修复讨论串](https://www.reddit.com/r/GeminiAI/comments/1sk0gxh/photo_restoration_gemini_stunning_result/)（`RPR-0047`、`RPR-0048`）

### 线索与方法论

- [PromptBase archival expert](https://promptbase.com/skill/old-photo-restoration-archival-expert)（`RPR-0041`，付费线索）
- [GPT Image 2 Studio old-photo prompts](https://gptimage2studio.com/gpt-image-2-prompts/old-photo-restore-prompts)（`RPR-0042`，待浏览器复核）
- [PromptBase old photo restoration prompt 2](https://www.promptbase.com/app/old-photo-restoration-prompt-2)（`RPR-0043`，付费线索）
- [PromptsGrid：Vintage Photo Restoration and Upscaling](https://promptsgrid.com/en/prompts/10185)（`RPR-0051`）
- [GPT Image Prompt：old photo restoration templates](https://gpt-image-prompt.com/templates/old-photo-restoration)（`RPR-0052`）
- [Bringing Old Photos Back to Life](https://openaccess.thecvf.com/content_CVPR_2020/papers/Wan_Bringing_Old_Photos_Back_to_Life_CVPR_2020_paper.pdf)（`RPR-0044`）
- [Pik-Fix: Restoring and Colorizing Old Photos](https://openaccess.thecvf.com/content/WACV2023/papers/Xu_Pik-Fix_Restoring_and_Colorizing_Old_Photos_WACV_2023_paper.pdf)（`RPR-0045`）

## 进入公开图鉴前的闸门

研究池记录默认不是公开库记录。要进入 `data/prompts.jsonl`，至少要完成：

1. **作者核验**：确认是原创、明确署名转载，或获得作者许可；只知道发布账号不够。
2. **许可核验**：有开放许可证就按许可证执行；没有许可证的页面只展示短摘录和来源链接，不能批量转载全文。
3. **严格范围核验**：确实处理人物照片或人像主体；纯广告、海报、物体、风格化艺术图和无人物图剔除。
4. **近重复核验**：先去掉 `Title:`、`Prompt:`、转发包装、参数默认值和标点差异，再与现有库做相似度聚类。
5. **实图核验**：至少检查脸部身份、损伤是否消失、是否出现新人物/新文字/换脸，以及原图、修复版、上色版是否清楚区分。
6. **风险标记**：缺失区域、极端低清、现代相机升级和 HDR/美颜必须分别打标，不能用“修复”一词掩盖生成式推断。

下一步应当先对 `RPR-0001`–`RPR-0037` 做实图与作者逐条核验，再处理新增的 `RPR-0038`–`RPR-0052` 线索，最后把合格记录以“严格修复 / 上色衍生 / 推断重建 / 低清救援”四个二级方向合入公开图鉴。新增线索与学术参考暂不自动发布。
