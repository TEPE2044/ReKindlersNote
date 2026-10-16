import { defineConfig } from 'vitepress'

const volumes = [
  {
    text: '第一章：数据结构五原型',
    items: [
      { text: '数组与双指针', link: '/01-数据结构五原型/ds-01-数组与双指针' },
      { text: '链表翻转', link: '/01-数据结构五原型/ds-02-链表翻转' },
      { text: '二分查找', link: '/01-数据结构五原型/ds-03-二分查找' },
      { text: '合并两个有序数组', link: '/01-数据结构五原型/ds-04-合并两个有序数组' },
      { text: '栈、队列、括号', link: '/01-数据结构五原型/ds-05-栈队列与括号' },
    ],
  },
  {
    text: '第二章：JavaScript 基础补漏',
    items: [
      { text: '异步与事件循环', link: '/02-JavaScript基础补漏/js-01-异步与事件循环' },
      { text: '事件与 DOM', link: '/02-JavaScript基础补漏/js-02-事件与DOM' },
      { text: '手写三件', link: '/02-JavaScript基础补漏/js-03-手写三件' },
    ],
  },
  {
    text: '第三章：JavaScript 核心补完',
    items: [
      { text: '作用域与闭包', link: '/03-JavaScript核心补完/js-04-作用域与闭包' },
      { text: 'this 与原型链', link: '/03-JavaScript核心补完/js-05-this与原型链' },
      { text: 'ES6 只补三处', link: '/03-JavaScript核心补完/js-06-ES6只补三处' },
      { text: '类型系统只补一处', link: '/03-JavaScript核心补完/js-07-类型系统只补一处' },
      { text: '错误处理', link: '/03-JavaScript核心补完/js-08-错误处理' },
      { text: '模块', link: '/03-JavaScript核心补完/js-09-模块' },
      { text: 'JSON 与序列化', link: '/03-JavaScript核心补完/js-10-JSON与序列化' },
      { text: '正则基础', link: '/03-JavaScript核心补完/js-11-正则基础' },
    ],
  },
  {
    text: '第四章：平台实战',
    items: [
      { text: 'Playwright 基础', link: '/04-平台实战/pf-01-Playwright基础' },
      { text: '用例组织是树', link: '/04-平台实战/pf-02-用例组织是树' },
      { text: '状态流转是状态机', link: '/04-平台实战/pf-03-状态流转是状态机' },
      { text: '断言判断是递归', link: '/04-平台实战/pf-04-断言判断是递归' },
    ],
  },
  {
    text: '附录',
    items: [
      { text: '目录', link: '/附录/index' },
      { text: '读法', link: '/附录/00-读法' },
      { text: '作答说明', link: '/附录/作答说明' },
      { text: '诊断地图', link: '/附录/01-诊断地图' },
      { text: '出口', link: '/附录/outro' },
    ],
  },
]

export default defineConfig({
  title: '熵减阁',
  description: '持续扩展的知识库，当前以 JavaScript 为主，未来会继续收录更多语言与技术方向。',
  lang: 'zh-CN',
  cleanUrls: true,
  // GitHub Pages 项目站：https://tepe2044.github.io/ReKindlersNote/
  base: '/ReKindlersNote/',

  // Only internal project documents are excluded. Lesson Markdown remains the source of truth.
  srcExclude: [
    '需求.md',
    '需求讨论.md',
    '大纲.md',
    '分工.md',
    'AGENTS.md',
    'README.md',
    '教材质量报告/**',
    '作答/**',
    'review/**',
    'dev/**',
  ],



  themeConfig: {
    nav: [{ text: '完整目录', link: '/附录/index' }],
    sidebar: volumes,
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一节', next: '下一节' },
    sidebarMenuLabel: '章节目录',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
