// Study topics and question patterns by company tier and topic

export type CompanyTier = 'faang' | 'tier1' | 'tier2' | 'startup'
export type TopicCategory = 'dsa' | 'dbms' | 'oops' | 'cn' | 'system_design' | 'behavioral'

export interface StudyTopic {
  id: string
  name: string
  category: TopicCategory
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  resources: string[]
  estimatedTime: string
}

export interface PracticeQuestion {
  id: string
  title: string
  topic: string
  category: TopicCategory
  difficulty: 'easy' | 'medium' | 'hard'
  platform: 'leetcode' | 'hackerrank' | 'geeksforgeeks' | 'general'
  url?: string
  pattern: string
  companies: string[]
}

// Company tier mapping based on known companies
export const getCompanyTier = (companyName: string): CompanyTier => {
  const name = companyName.toLowerCase()

  const faang = ['google', 'meta', 'facebook', 'amazon', 'apple', 'netflix', 'microsoft', 'nvidia', 'tesla', 'openai', 'anthropic', 'deepmind']
  const tier1 = ['uber', 'airbnb', 'stripe', 'linkedin', 'twitter', 'x', 'dropbox', 'salesforce', 'adobe', 'oracle', 'intel', 'qualcomm', 'paypal', 'square', 'snap', 'pinterest', 'lyft', 'doordash', 'instacart', 'coinbase', 'robinhood', 'databricks', 'snowflake', 'palantir', 'atlassian']
  const tier2 = ['walmart', 'target', 'jpmorgan', 'goldman', 'morgan stanley', 'capital one', 'american express', 'visa', 'mastercard', 'bloomberg', 'citadel', 'two sigma', 'jane street', 'ibm', 'cisco', 'vmware', 'servicenow', 'workday', 'splunk', 'zoom', 'slack', 'twilio']

  if (faang.some(c => name.includes(c))) return 'faang'
  if (tier1.some(c => name.includes(c))) return 'tier1'
  if (tier2.some(c => name.includes(c))) return 'tier2'
  return 'startup'
}

// DSA Topics by difficulty
export const dsaTopics: StudyTopic[] = [
  // Arrays & Strings
  { id: 'arrays-basics', name: 'Arrays & Two Pointers', category: 'dsa', difficulty: 'easy', description: 'Basic array manipulation, two-pointer technique', resources: ['NeetCode', 'LeetCode Explore'], estimatedTime: '2-3 hours' },
  { id: 'sliding-window', name: 'Sliding Window', category: 'dsa', difficulty: 'medium', description: 'Fixed and variable size sliding window problems', resources: ['LeetCode Sliding Window', 'NeetCode Roadmap'], estimatedTime: '3-4 hours' },
  { id: 'prefix-sum', name: 'Prefix Sum', category: 'dsa', difficulty: 'medium', description: 'Cumulative sum technique for range queries', resources: ['LeetCode Explore'], estimatedTime: '2 hours' },

  // Hash Maps
  { id: 'hashmaps', name: 'Hash Maps & Sets', category: 'dsa', difficulty: 'easy', description: 'Using hash maps for O(1) lookups', resources: ['NeetCode', 'LeetCode'], estimatedTime: '2-3 hours' },

  // Linked Lists
  { id: 'linked-lists', name: 'Linked Lists', category: 'dsa', difficulty: 'medium', description: 'Singly/doubly linked lists, fast-slow pointers', resources: ['LeetCode Linked List', 'NeetCode'], estimatedTime: '3-4 hours' },

  // Stacks & Queues
  { id: 'stacks', name: 'Stacks & Monotonic Stack', category: 'dsa', difficulty: 'medium', description: 'Stack operations, next greater element patterns', resources: ['LeetCode Stack', 'NeetCode'], estimatedTime: '3-4 hours' },

  // Trees
  { id: 'binary-trees', name: 'Binary Trees', category: 'dsa', difficulty: 'medium', description: 'Tree traversals, DFS, BFS on trees', resources: ['NeetCode', 'LeetCode Tree'], estimatedTime: '4-5 hours' },
  { id: 'bst', name: 'Binary Search Trees', category: 'dsa', difficulty: 'medium', description: 'BST operations, validation, balancing', resources: ['LeetCode BST'], estimatedTime: '3-4 hours' },

  // Graphs
  { id: 'graphs-basics', name: 'Graph Traversal', category: 'dsa', difficulty: 'medium', description: 'BFS, DFS, connected components', resources: ['NeetCode Graph', 'LeetCode Graph'], estimatedTime: '4-5 hours' },
  { id: 'graphs-advanced', name: 'Advanced Graphs', category: 'dsa', difficulty: 'hard', description: 'Dijkstra, Bellman-Ford, Union Find, Topological Sort', resources: ['NeetCode', 'William Fiset YouTube'], estimatedTime: '6-8 hours' },

  // Dynamic Programming
  { id: 'dp-1d', name: '1D Dynamic Programming', category: 'dsa', difficulty: 'medium', description: 'Fibonacci, climbing stairs, house robber patterns', resources: ['NeetCode DP', 'LeetCode DP'], estimatedTime: '4-5 hours' },
  { id: 'dp-2d', name: '2D Dynamic Programming', category: 'dsa', difficulty: 'hard', description: 'Grid problems, LCS, edit distance', resources: ['NeetCode', 'LeetCode'], estimatedTime: '6-8 hours' },

  // Binary Search
  { id: 'binary-search', name: 'Binary Search', category: 'dsa', difficulty: 'medium', description: 'Classic binary search and its variations', resources: ['LeetCode Binary Search', 'NeetCode'], estimatedTime: '3-4 hours' },

  // Backtracking
  { id: 'backtracking', name: 'Backtracking', category: 'dsa', difficulty: 'hard', description: 'Permutations, combinations, subsets, N-Queens', resources: ['NeetCode Backtracking'], estimatedTime: '4-5 hours' },

  // Heap
  { id: 'heaps', name: 'Heaps & Priority Queues', category: 'dsa', difficulty: 'medium', description: 'Min/max heaps, top K problems', resources: ['LeetCode Heap', 'NeetCode'], estimatedTime: '3-4 hours' },

  // Tries
  { id: 'tries', name: 'Tries', category: 'dsa', difficulty: 'hard', description: 'Prefix trees, autocomplete, word search', resources: ['NeetCode', 'LeetCode Trie'], estimatedTime: '3-4 hours' },
]

// CS Fundamentals Topics
export const csTopics: StudyTopic[] = [
  // DBMS
  { id: 'dbms-basics', name: 'SQL & RDBMS Basics', category: 'dbms', difficulty: 'easy', description: 'SQL queries, joins, normalization', resources: ['W3Schools SQL', 'Mode Analytics'], estimatedTime: '3-4 hours' },
  { id: 'dbms-advanced', name: 'Database Design & Indexing', category: 'dbms', difficulty: 'medium', description: 'Indexing, transactions, ACID properties', resources: ['CMU Database Course'], estimatedTime: '4-5 hours' },
  { id: 'dbms-nosql', name: 'NoSQL Databases', category: 'dbms', difficulty: 'medium', description: 'MongoDB, Redis, when to use NoSQL', resources: ['MongoDB University'], estimatedTime: '2-3 hours' },

  // OOPs
  { id: 'oops-basics', name: 'OOP Fundamentals', category: 'oops', difficulty: 'easy', description: 'Classes, objects, encapsulation, inheritance', resources: ['GeeksforGeeks OOP'], estimatedTime: '2-3 hours' },
  { id: 'oops-principles', name: 'SOLID Principles', category: 'oops', difficulty: 'medium', description: 'SOLID, DRY, KISS principles', resources: ['Refactoring Guru'], estimatedTime: '3-4 hours' },
  { id: 'design-patterns', name: 'Design Patterns', category: 'oops', difficulty: 'hard', description: 'Singleton, Factory, Observer, Strategy patterns', resources: ['Refactoring Guru', 'Head First Design Patterns'], estimatedTime: '6-8 hours' },

  // Computer Networks
  { id: 'cn-basics', name: 'Networking Basics', category: 'cn', difficulty: 'easy', description: 'OSI model, TCP/IP, HTTP/HTTPS', resources: ['Computer Networking: A Top-Down Approach'], estimatedTime: '3-4 hours' },
  { id: 'cn-protocols', name: 'Network Protocols', category: 'cn', difficulty: 'medium', description: 'DNS, DHCP, ARP, routing protocols', resources: ['GeeksforGeeks CN'], estimatedTime: '3-4 hours' },
  { id: 'cn-security', name: 'Network Security', category: 'cn', difficulty: 'medium', description: 'TLS/SSL, encryption, authentication', resources: ['OWASP'], estimatedTime: '2-3 hours' },

  // System Design
  { id: 'sd-basics', name: 'System Design Basics', category: 'system_design', difficulty: 'medium', description: 'Scalability, load balancing, caching', resources: ['System Design Primer', 'Grokking System Design'], estimatedTime: '4-5 hours' },
  { id: 'sd-components', name: 'System Components', category: 'system_design', difficulty: 'medium', description: 'Databases, message queues, CDNs', resources: ['ByteByteGo', 'Alex Xu book'], estimatedTime: '4-5 hours' },
  { id: 'sd-practice', name: 'Design Practice', category: 'system_design', difficulty: 'hard', description: 'Design URL shortener, Twitter, Netflix', resources: ['System Design Interview Book', 'NeetCode System Design'], estimatedTime: '8-10 hours' },
]

// Practice questions by pattern and difficulty
export const practiceQuestions: PracticeQuestion[] = [
  // Two Pointers
  { id: 'lc-1', title: 'Two Sum', topic: 'Arrays', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/two-sum/', pattern: 'Hash Map', companies: ['google', 'amazon', 'meta', 'microsoft'] },
  { id: 'lc-167', title: 'Two Sum II - Input Array Is Sorted', topic: 'Arrays', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', pattern: 'Two Pointers', companies: ['amazon', 'meta'] },
  { id: 'lc-15', title: '3Sum', topic: 'Arrays', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/3sum/', pattern: 'Two Pointers', companies: ['google', 'amazon', 'meta', 'microsoft', 'apple'] },
  { id: 'lc-11', title: 'Container With Most Water', topic: 'Arrays', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/container-with-most-water/', pattern: 'Two Pointers', companies: ['amazon', 'meta', 'google'] },

  // Sliding Window
  { id: 'lc-121', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', pattern: 'Sliding Window', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-3', title: 'Longest Substring Without Repeating Characters', topic: 'Strings', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', pattern: 'Sliding Window', companies: ['amazon', 'meta', 'google', 'microsoft', 'apple'] },
  { id: 'lc-424', title: 'Longest Repeating Character Replacement', topic: 'Strings', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', pattern: 'Sliding Window', companies: ['google', 'amazon'] },
  { id: 'lc-76', title: 'Minimum Window Substring', topic: 'Strings', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/minimum-window-substring/', pattern: 'Sliding Window', companies: ['meta', 'google', 'amazon', 'linkedin'] },

  // Binary Search
  { id: 'lc-704', title: 'Binary Search', topic: 'Binary Search', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/binary-search/', pattern: 'Binary Search', companies: ['google', 'microsoft'] },
  { id: 'lc-33', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', pattern: 'Binary Search', companies: ['meta', 'amazon', 'google', 'microsoft'] },
  { id: 'lc-153', title: 'Find Minimum in Rotated Sorted Array', topic: 'Binary Search', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', pattern: 'Binary Search', companies: ['meta', 'amazon'] },
  { id: 'lc-4', title: 'Median of Two Sorted Arrays', topic: 'Binary Search', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', pattern: 'Binary Search', companies: ['google', 'amazon', 'meta'] },

  // Linked Lists
  { id: 'lc-206', title: 'Reverse Linked List', topic: 'Linked Lists', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/reverse-linked-list/', pattern: 'Linked List', companies: ['amazon', 'meta', 'microsoft', 'apple'] },
  { id: 'lc-21', title: 'Merge Two Sorted Lists', topic: 'Linked Lists', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', pattern: 'Linked List', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-141', title: 'Linked List Cycle', topic: 'Linked Lists', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/linked-list-cycle/', pattern: 'Fast-Slow Pointers', companies: ['amazon', 'meta', 'microsoft'] },
  { id: 'lc-19', title: 'Remove Nth Node From End of List', topic: 'Linked Lists', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', pattern: 'Two Pointers', companies: ['meta', 'amazon'] },
  { id: 'lc-143', title: 'Reorder List', topic: 'Linked Lists', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/reorder-list/', pattern: 'Linked List', companies: ['meta', 'amazon'] },
  { id: 'lc-23', title: 'Merge k Sorted Lists', topic: 'Linked Lists', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', pattern: 'Heap', companies: ['amazon', 'meta', 'google', 'microsoft'] },

  // Trees
  { id: 'lc-226', title: 'Invert Binary Tree', topic: 'Trees', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/invert-binary-tree/', pattern: 'Tree DFS', companies: ['google', 'amazon'] },
  { id: 'lc-104', title: 'Maximum Depth of Binary Tree', topic: 'Trees', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', pattern: 'Tree DFS', companies: ['amazon', 'meta', 'microsoft'] },
  { id: 'lc-100', title: 'Same Tree', topic: 'Trees', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/same-tree/', pattern: 'Tree DFS', companies: ['amazon', 'meta'] },
  { id: 'lc-102', title: 'Binary Tree Level Order Traversal', topic: 'Trees', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', pattern: 'Tree BFS', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-98', title: 'Validate Binary Search Tree', topic: 'Trees', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/validate-binary-search-tree/', pattern: 'BST', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-230', title: 'Kth Smallest Element in a BST', topic: 'Trees', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', pattern: 'BST', companies: ['amazon', 'meta'] },
  { id: 'lc-124', title: 'Binary Tree Maximum Path Sum', topic: 'Trees', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', pattern: 'Tree DFS', companies: ['meta', 'google', 'amazon'] },
  { id: 'lc-297', title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', pattern: 'Tree', companies: ['meta', 'amazon', 'google', 'microsoft'] },

  // Graphs
  { id: 'lc-200', title: 'Number of Islands', topic: 'Graphs', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/number-of-islands/', pattern: 'Graph DFS/BFS', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-133', title: 'Clone Graph', topic: 'Graphs', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/clone-graph/', pattern: 'Graph DFS', companies: ['meta', 'amazon'] },
  { id: 'lc-207', title: 'Course Schedule', topic: 'Graphs', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/course-schedule/', pattern: 'Topological Sort', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-417', title: 'Pacific Atlantic Water Flow', topic: 'Graphs', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', pattern: 'Graph DFS', companies: ['google', 'amazon'] },
  { id: 'lc-269', title: 'Alien Dictionary', topic: 'Graphs', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/alien-dictionary/', pattern: 'Topological Sort', companies: ['meta', 'google', 'amazon', 'airbnb'] },

  // Dynamic Programming
  { id: 'lc-70', title: 'Climbing Stairs', topic: 'DP', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/climbing-stairs/', pattern: '1D DP', companies: ['amazon', 'microsoft', 'google'] },
  { id: 'lc-198', title: 'House Robber', topic: 'DP', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/house-robber/', pattern: '1D DP', companies: ['amazon', 'google', 'microsoft'] },
  { id: 'lc-322', title: 'Coin Change', topic: 'DP', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/coin-change/', pattern: '1D DP', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-300', title: 'Longest Increasing Subsequence', topic: 'DP', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', pattern: '1D DP', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-1143', title: 'Longest Common Subsequence', topic: 'DP', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/longest-common-subsequence/', pattern: '2D DP', companies: ['amazon', 'google'] },
  { id: 'lc-62', title: 'Unique Paths', topic: 'DP', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/unique-paths/', pattern: '2D DP', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-72', title: 'Edit Distance', topic: 'DP', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/edit-distance/', pattern: '2D DP', companies: ['amazon', 'google'] },

  // Heap
  { id: 'lc-215', title: 'Kth Largest Element in an Array', topic: 'Heap', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', pattern: 'Heap', companies: ['meta', 'amazon', 'google', 'microsoft'] },
  { id: 'lc-347', title: 'Top K Frequent Elements', topic: 'Heap', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/top-k-frequent-elements/', pattern: 'Heap', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-295', title: 'Find Median from Data Stream', topic: 'Heap', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/find-median-from-data-stream/', pattern: 'Two Heaps', companies: ['amazon', 'meta', 'google', 'microsoft'] },

  // Backtracking
  { id: 'lc-78', title: 'Subsets', topic: 'Backtracking', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/subsets/', pattern: 'Backtracking', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-46', title: 'Permutations', topic: 'Backtracking', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/permutations/', pattern: 'Backtracking', companies: ['meta', 'amazon', 'google', 'microsoft'] },
  { id: 'lc-39', title: 'Combination Sum', topic: 'Backtracking', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/combination-sum/', pattern: 'Backtracking', companies: ['amazon', 'meta'] },
  { id: 'lc-79', title: 'Word Search', topic: 'Backtracking', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/word-search/', pattern: 'Backtracking', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-51', title: 'N-Queens', topic: 'Backtracking', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/n-queens/', pattern: 'Backtracking', companies: ['amazon', 'meta', 'google'] },

  // Stack
  { id: 'lc-20', title: 'Valid Parentheses', topic: 'Stack', category: 'dsa', difficulty: 'easy', platform: 'leetcode', url: 'https://leetcode.com/problems/valid-parentheses/', pattern: 'Stack', companies: ['amazon', 'meta', 'google', 'microsoft'] },
  { id: 'lc-155', title: 'Min Stack', topic: 'Stack', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/min-stack/', pattern: 'Stack', companies: ['amazon', 'meta', 'google'] },
  { id: 'lc-739', title: 'Daily Temperatures', topic: 'Stack', category: 'dsa', difficulty: 'medium', platform: 'leetcode', url: 'https://leetcode.com/problems/daily-temperatures/', pattern: 'Monotonic Stack', companies: ['meta', 'amazon'] },
  { id: 'lc-84', title: 'Largest Rectangle in Histogram', topic: 'Stack', category: 'dsa', difficulty: 'hard', platform: 'leetcode', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', pattern: 'Monotonic Stack', companies: ['amazon', 'google'] },
]

// Get recommended questions based on company tier and count
export function getRecommendedQuestions(
  companyName: string,
  count: number = 15,
  includeHard: boolean = true
): PracticeQuestion[] {
  const tier = getCompanyTier(companyName)
  const companyLower = companyName.toLowerCase()

  // Filter questions based on tier
  let filtered = practiceQuestions

  // For FAANG, include all difficulties
  // For tier1, mostly medium with some hard
  // For tier2/startup, mostly easy/medium
  if (tier === 'startup') {
    filtered = practiceQuestions.filter(q => q.difficulty !== 'hard' || includeHard)
  }

  // Prioritize questions asked at this specific company
  const companySpecific = filtered.filter(q =>
    q.companies.some(c => companyLower.includes(c))
  )

  // Get a balanced mix
  const easy = filtered.filter(q => q.difficulty === 'easy')
  const medium = filtered.filter(q => q.difficulty === 'medium')
  const hard = filtered.filter(q => q.difficulty === 'hard')

  // Calculate distribution based on tier
  let easyCount: number, mediumCount: number, hardCount: number

  if (tier === 'faang') {
    easyCount = Math.floor(count * 0.2)
    mediumCount = Math.floor(count * 0.5)
    hardCount = count - easyCount - mediumCount
  } else if (tier === 'tier1') {
    easyCount = Math.floor(count * 0.25)
    mediumCount = Math.floor(count * 0.55)
    hardCount = count - easyCount - mediumCount
  } else {
    easyCount = Math.floor(count * 0.35)
    mediumCount = Math.floor(count * 0.5)
    hardCount = count - easyCount - mediumCount
  }

  // Shuffle and pick
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

  const result = [
    ...shuffle(companySpecific).slice(0, Math.floor(count * 0.4)),
    ...shuffle(easy).slice(0, easyCount),
    ...shuffle(medium).slice(0, mediumCount),
    ...shuffle(hard).slice(0, hardCount),
  ]

  // Remove duplicates and limit to count
  const unique = Array.from(new Map(result.map(q => [q.id, q])).values())
  return shuffle(unique).slice(0, count)
}

// Get recommended topics for interview prep
export function getInterviewTopics(
  companyName: string,
  role: string
): { dsa: StudyTopic[], cs: StudyTopic[] } {
  const tier = getCompanyTier(companyName)
  const roleLower = role.toLowerCase()

  // Check if it's a senior role that needs system design
  const needsSystemDesign =
    roleLower.includes('senior') ||
    roleLower.includes('staff') ||
    roleLower.includes('lead') ||
    roleLower.includes('architect') ||
    roleLower.includes('principal')

  // Filter DSA topics based on tier
  let dsaFiltered = dsaTopics
  if (tier === 'startup' || tier === 'tier2') {
    dsaFiltered = dsaTopics.filter(t => t.difficulty !== 'hard')
  }

  // Filter CS topics
  let csFiltered = csTopics.filter(t => {
    // Always include basics
    if (t.difficulty === 'easy') return true
    // Include system design only for senior roles or FAANG
    if (t.category === 'system_design') {
      return needsSystemDesign || tier === 'faang'
    }
    return true
  })

  return {
    dsa: dsaFiltered,
    cs: csFiltered,
  }
}
