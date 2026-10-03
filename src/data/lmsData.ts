import { LMSCourse, Lecturer, LMSResource, LMSAssignment, LMSAnnouncement, LMSDiscussion } from '../types/lms';

export const INITIAL_LECTURERS: Lecturer[] = [
  {
    id: 'lec-1',
    name: 'Dr. Rajesh Sharma',
    title: 'Professor & Head of Data Systems',
    department: 'Computer Science & Engineering',
    email: 'rsharma@klh.edu.in',
    cabin: 'Academic Block B, Room 304',
    phone: '+91 98480 12345',
    avatar: 'RS',
    assignedCourseCodes: ['25SC1204E', '25CS1302E'],
    officeHours: 'Mon & Wed: 3:00 PM - 5:00 PM',
    bio: 'Ph.D. from IIT Madras. 16+ years experience in Distributed Algorithms, High-performance Graph Systems and Database Engines.'
  },
  {
    id: 'lec-2',
    name: 'Prof. Ananya Roy',
    title: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'ananya.roy@klh.edu.in',
    cabin: 'Academic Block A, Room 412',
    phone: '+91 97000 67890',
    avatar: 'AR',
    assignedCourseCodes: ['25CS1201E', '25SC1104E'],
    officeHours: 'Tue & Thu: 2:00 PM - 4:00 PM',
    bio: 'Ex-Senior Frontend Architect at Adobe. Specializes in Web Performance, Modern UI Engineering & Reactive Systems.'
  },
  {
    id: 'lec-3',
    name: 'Dr. K. Venkatesh',
    title: 'Assistant Professor & Lab In-charge',
    department: 'Artificial Intelligence & Data Science',
    email: 'k.venkatesh@klh.edu.in',
    cabin: 'T-Hub Building, Room 208',
    phone: '+91 94401 54321',
    avatar: 'KV',
    assignedCourseCodes: ['25SC1306E', '25MT1205E'],
    officeHours: 'Wed & Fri: 11:00 AM - 1:00 PM',
    bio: 'Doctorate in Deep Learning from IISc Bangalore. Research focus on Transformer Architectures & Edge AI deployment.'
  },
  {
    id: 'lec-4',
    name: 'Dr. Sunita Patil',
    title: 'Associate Professor',
    department: 'Electronics & Computer Engineering',
    email: 'sunita.patil@klh.edu.in',
    cabin: 'Block C, Room 102',
    phone: '+91 91234 56789',
    avatar: 'SP',
    assignedCourseCodes: ['25EC2101E'],
    officeHours: 'Mon & Thu: 10:00 AM - 12:00 PM',
    bio: 'Researcher in RISC-V SoC Architecture, Hardware Synthesis & Embedded Systems.'
  }
];

export const INITIAL_COURSES: LMSCourse[] = [
  {
    id: 'c-dsa',
    code: '25SC1204E',
    name: 'Data Structures and Algorithms - 1',
    department: 'CSE',
    credits: 4,
    semester: 'Semester II',
    academicYear: '2024-2025',
    color: '#FF1053',
    accentBg: 'bg-brand-pink/10 border-brand-pink/40 text-brand-pink',
    instructor: {
      id: 'lec-1',
      name: 'Dr. Rajesh Sharma',
      email: 'rsharma@klh.edu.in',
      cabin: 'Block B-304',
      avatar: 'RS',
      title: 'Professor'
    },
    schedule: 'Mon (09:00 - 10:40 AM) & Wed (01:30 - 03:10 PM)',
    room: 'LH-201 & Lab 4',
    progress: 72,
    syllabusUnits: [
      { unitNumber: 1, title: 'Complexity Analysis & Linear Structures', topics: ['Asymptotic Notations', 'Singly & Doubly Linked Lists', 'Circular Queues'], completed: true },
      { unitNumber: 2, title: 'Stacks, Queues & Recursion Trees', topics: ['Stack Infix to Postfix', 'Monotonic Stacks', 'Recursive Backtracking'], completed: true },
      { unitNumber: 3, title: 'Non-Linear Structures: Trees & BST', topics: ['Binary Tree Traversals', 'AVL Trees Self-balancing', 'Red-Black Concepts'], completed: true },
      { unitNumber: 4, title: 'Priority Queues & Graph Algorithms', topics: ['Binary Heaps', 'Dijkstra Shortest Path', 'Kruskal & Prim MST'], completed: false },
      { unitNumber: 5, title: 'Hashing & Advanced String Matching', topics: ['Collision Resolution', 'Rabin-Karp', 'KMP Algorithm'], completed: false },
    ]
  },
  {
    id: 'c-ui',
    code: '25CS1201E',
    name: 'Front End Development Frameworks & UI Engineering',
    department: 'CSE',
    credits: 4,
    semester: 'Semester II',
    academicYear: '2024-2025',
    color: '#00B4D8',
    accentBg: 'bg-brand-blue/10 border-brand-blue/40 text-brand-blue',
    instructor: {
      id: 'lec-2',
      name: 'Prof. Ananya Roy',
      email: 'ananya.roy@klh.edu.in',
      cabin: 'Block A-412',
      avatar: 'AR',
      title: 'Associate Professor'
    },
    schedule: 'Tue (11:00 AM - 12:40 PM) & Thu (09:00 - 10:40 AM)',
    room: 'LH-105 & Mac Lab 2',
    progress: 85,
    syllabusUnits: [
      { unitNumber: 1, title: 'Modern JavaScript (ESNext) & DOM Engine', topics: ['Event Loop & Microtasks', 'Closures & Prototypes', 'Canvas & Web Workers'], completed: true },
      { unitNumber: 2, title: 'React 19 Core & Component Lifecycle', topics: ['Server Components', 'Hooks internals', 'Custom Hook Patterns'], completed: true },
      { unitNumber: 3, title: 'State Architecture & Data Flow', topics: ['Zustand & Context API', 'Optimistic UI', 'TanStack Query'], completed: true },
      { unitNumber: 4, title: 'Tailwind CSS & Neo-Brutalist Design', topics: ['CSS Variables', 'Micro-interactions with Motion', 'Design Tokens'], completed: true },
      { unitNumber: 5, title: 'Fullstack Next.js & Edge Rendering', topics: ['App Router & Middleware', 'SSR/SSG/ISR', 'Web Vitals Optimization'], completed: false },
    ]
  },
  {
    id: 'c-db',
    code: '25CS1302E',
    name: 'Database Systems & Distributed Backend Dev',
    department: 'CSE',
    credits: 3,
    semester: 'Semester II',
    academicYear: '2024-2025',
    color: '#8338EC',
    accentBg: 'bg-brand-purple/10 border-brand-purple/40 text-brand-purple',
    instructor: {
      id: 'lec-1',
      name: 'Dr. Rajesh Sharma',
      email: 'rsharma@klh.edu.in',
      cabin: 'Block B-304',
      avatar: 'RS',
      title: 'Professor'
    },
    schedule: 'Mon (02:00 - 03:40 PM) & Fri (10:00 - 11:40 AM)',
    room: 'LH-302 & DB Lab',
    progress: 60,
    syllabusUnits: [
      { unitNumber: 1, title: 'Relational Model & Advanced SQL', topics: ['Window Functions', 'Recursive CTEs', 'Complex Grouping Sets'], completed: true },
      { unitNumber: 2, title: 'Index Internals & Query Optimizer', topics: ['B-Tree / B+Tree Storage', 'LSM-Trees', 'EXPLAIN ANALYZE tuning'], completed: true },
      { unitNumber: 3, title: 'ACID & Concurrency Control', topics: ['2-Phase Locking', 'MVCC Isolation Levels', 'Write-Ahead Logging (WAL)'], completed: true },
      { unitNumber: 4, title: 'Distributed Transactions & Sharding', topics: ['2PC & Paxos/Raft', 'Consistent Hashing', 'CAP Theorem in Practice'], completed: false },
      { unitNumber: 5, title: 'NoSQL & Realtime Streaming DBs', topics: ['Cassandra Column Family', 'Redis Caching & PubSub', 'Vector Databases'], completed: false },
    ]
  },
  {
    id: 'c-ai',
    code: '25SC1306E',
    name: 'Computational Foundations for Artificial Intelligence',
    department: 'AI & DS',
    credits: 4,
    semester: 'Semester II',
    academicYear: '2024-2025',
    color: '#06D6A0',
    accentBg: 'bg-brand-green/10 border-brand-green/40 text-brand-green',
    instructor: {
      id: 'lec-3',
      name: 'Dr. K. Venkatesh',
      email: 'k.venkatesh@klh.edu.in',
      cabin: 'T-Hub 208',
      avatar: 'KV',
      title: 'Assistant Professor'
    },
    schedule: 'Wed (10:00 - 11:40 AM) & Fri (02:00 - 03:40 PM)',
    room: 'AI Supercomputing Lab',
    progress: 68,
    syllabusUnits: [
      { unitNumber: 1, title: 'Linear Algebra & Tensors for ML', topics: ['Eigendecomposition', 'SVD & PCA dimensionality reduction', 'Matrix Calculus'], completed: true },
      { unitNumber: 2, title: 'Probability & Bayesian Inference', topics: ['Gaussian Mixtures', 'MLE vs MAP Estimation', 'Markov Chains'], completed: true },
      { unitNumber: 3, title: 'Gradient Optimization Methods', topics: ['Stochastic Gradient Descent', 'Adam & Momentum', 'Loss Surfaces & Hessian'], completed: true },
      { unitNumber: 4, title: 'Neural Networks & Backpropagation', topics: ['Computational Graphs', 'Activation Dynamics', 'Regularization Techniques'], completed: false },
      { unitNumber: 5, title: 'Transformer Foundations & Attention', topics: ['Self-Attention Mechanism', 'Multi-Head Projections', 'Positional Encoding'], completed: false },
    ]
  },
  {
    id: 'c-dld',
    code: '25EC2101E',
    name: 'Digital Design and Computer Architecture',
    department: 'ECE/CSE',
    credits: 3,
    semester: 'Semester II',
    academicYear: '2024-2025',
    color: '#FF7B00',
    accentBg: 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange',
    instructor: {
      id: 'lec-4',
      name: 'Dr. Sunita Patil',
      email: 'sunita.patil@klh.edu.in',
      cabin: 'Block C-102',
      avatar: 'SP',
      title: 'Associate Professor'
    },
    schedule: 'Tue (02:00 - 03:40 PM) & Thu (11:00 AM - 12:40 PM)',
    room: 'Hardware VLSI Lab',
    progress: 55,
    syllabusUnits: [
      { unitNumber: 1, title: 'Combinational Logic & Verilog HDL', topics: ['K-Maps', 'Multiplexers & ALUs', 'Verilog Synthesis'], completed: true },
      { unitNumber: 2, title: 'Sequential Circuits & Finite State Machines', topics: ['Flip-Flops', 'Mealy & Moore Machines', 'Timing Closure'], completed: true },
      { unitNumber: 3, title: 'Processor Datapath & Instruction Sets', topics: ['RISC-V 32-bit Architecture', 'Register Files', 'ALU Control Signals'], completed: false },
      { unitNumber: 4, title: 'Pipelining & Hazard Resolution', topics: ['5-stage RISC Pipeline', 'Data Hazards & Forwarding', 'Branch Prediction'], completed: false },
      { unitNumber: 5, title: 'Memory Hierarchy & Cache Coherence', topics: ['Direct Mapped vs Set-Associative', 'Virtual Memory & TLBs', 'Bus Protocols'], completed: false },
    ]
  }
];

export const INITIAL_RESOURCES: LMSResource[] = [
  {
    id: 'res-1',
    courseId: 'c-dsa',
    courseCode: '25SC1204E',
    courseName: 'Data Structures and Algorithms - 1',
    title: 'Unit 3: Complete AVL & Red-Black Trees Handbook with Rotations',
    description: 'Detailed lecture notes covering height balancing, LL/RR/LR/RL single & double rotations with step-by-step trace diagrams and C++ implementation examples.',
    unit: 'Unit 3',
    category: 'Lecture Notes',
    fileType: 'pdf',
    fileName: 'DSA_Unit3_AVL_RedBlack_Trees_Complete.pdf',
    fileSize: '4.2 MB',
    uploadedBy: 'Dr. Rajesh Sharma',
    lecturerRole: 'Course Faculty',
    uploadedAt: 'Yesterday, 4:30 PM',
    downloadCount: 142,
    pinned: true,
    tags: ['AVL Trees', 'Rotations', 'Data Structures', 'Exam Prep'],
    previewContent: `KL UNIVERSITY - DEPARTMENT OF COMPUTER SCIENCE
Course: 25SC1204E - Data Structures & Algorithms - 1
Instructor: Dr. Rajesh Sharma

UNIT 3: SELF-BALANCING BINARY SEARCH TREES

1. MOTIVATION FOR SELF-BALANCING:
In a standard Binary Search Tree (BST), insertion of sorted or nearly-sorted elements can lead to a degenerate tree resembling a linked list with worst-case search complexity O(n). To guarantee logarithmic search, insertion, and deletion O(log n), we maintain a balanced height invariant.

2. AVL TREE PROPERTIES:
For every node 'x' in an AVL tree:
Balance Factor (BF) = Height(LeftSubtree) - Height(RightSubtree)
Condition for Balance: BF(x) in {-1, 0, +1}.

3. ROTATION PRIMITIVES:
a) LL Case (Left-Left): Single Right Rotation (rotateRight)
   - Pivot becomes the new root of the subtree.
   - Old root becomes the right child of the pivot.
b) RR Case (Right-Right): Single Left Rotation (rotateLeft)
   - Symmetric to LL case.
c) LR Case (Left-Right): Double Rotation (Left Rotation on child, then Right Rotation on node).
d) RL Case (Right-Left): Double Rotation (Right Rotation on child, then Left Rotation on node).

4. TIME & SPACE COMPLEXITIES:
- Search: O(log n) worst case
- Insertion: O(log n) with at most 2 rotations
- Deletion: O(log n) with up to O(log n) rotations propagated to root
- Space: O(n) with 1 extra byte or bits per node for balance factor/height storage.`
  },
  {
    id: 'res-2',
    courseId: 'c-dsa',
    courseCode: '25SC1204E',
    courseName: 'Data Structures and Algorithms - 1',
    title: 'Lab 4 Manual: Graph Traversal & Dijkstra Shortest Path Implementation',
    description: 'Official lab assignment specifications, test cases, and code templates for Breadth-First Search, Depth-First Search, and Dijkstra with adjacency lists.',
    unit: 'Unit 4',
    category: 'Lab Manual',
    fileType: 'code',
    fileName: 'DSA_Lab4_Graph_Algorithms_Starter.zip',
    fileSize: '1.8 MB',
    uploadedBy: 'Dr. Rajesh Sharma',
    lecturerRole: 'Course Faculty',
    uploadedAt: 'Sep 26, 2024',
    downloadCount: 198,
    pinned: true,
    tags: ['Lab', 'Graphs', 'Dijkstra', 'Starter Code'],
    previewContent: `// KLU CSE - Lab 4: Dijkstra's Algorithm Starter Template
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int, int> pii; // (distance, vertex)

vector<int> dijkstra(int V, vector<vector<pii>>& adj, int src) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<int> dist(V, 1e9);

    dist[src] = 0;
    pq.push({0, src});

    while(!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for(auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if(dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
  },
  {
    id: 'res-3',
    courseId: 'c-ui',
    courseCode: '25CS1201E',
    courseName: 'Front End Development Frameworks & UI Engineering',
    title: 'React 19 Server Components, Actions & Optimistic Hooks Slide Deck',
    description: 'Full lecture presentation containing architectural diagrams comparing traditional Client-Side SPA rendering vs React 19 RSC streaming and Server Actions.',
    unit: 'Unit 2',
    category: 'Slides / PPT',
    fileType: 'ppt',
    fileName: 'FE_Unit2_React19_Architecture_Masterclass.pptx',
    fileSize: '8.7 MB',
    uploadedBy: 'Prof. Ananya Roy',
    lecturerRole: 'Lead Instructor',
    uploadedAt: 'Sep 27, 2024',
    downloadCount: 220,
    pinned: true,
    tags: ['React 19', 'RSC', 'UI Architecture', 'Slides'],
    previewContent: `SLIDE 1: FRONTEND ENGINEERING & REACT 19 DEEP DIVE
Instructor: Prof. Ananya Roy
Module: Modern Framework Architecture

SLIDE 2: THE REVOLUTION OF REACT SERVER COMPONENTS (RSC)
- Traditional Model: Bundle everything to the client. Massive JS payload. Waterfall network calls.
- Server Components Model: Zero client JS for server-only logic, direct database/ORM calls inside components, streaming HTML over HTTP chunks.

SLIDE 3: REACT 19 PRIMITIVES:
1. useActionState(): Manages form state with pending states and automatic optimistic updates.
2. useOptimistic(): Immediate client feedback before network resolves.
3. use(): Unwraps promises and React context dynamically anywhere in render tree.
4. Server Actions: 'use server' directives enabling RPC calls with type safety.

SLIDE 4: DESIGN TOKENS & NEO-BRUTALIST STYLING
- Why bold high-contrast borders and vibrant accents win in user engagement.
- Achieving 60fps animations with CSS hardware acceleration & Framer Motion.`
  },
  {
    id: 'res-4',
    courseId: 'c-ui',
    courseCode: '25CS1201E',
    courseName: 'Front End Development Frameworks & UI Engineering',
    title: 'Tailwind CSS Cheatsheet & Neo-Brutalist Component Tokens',
    description: 'Quick reference guide with ready-to-use utility classes for custom drop-shadows, sticker borders, responsive typography and dark mode transitions.',
    unit: 'Unit 4',
    category: 'Reference Material',
    fileType: 'pdf',
    fileName: 'NeoBrutalist_Tailwind_Cheatsheet.pdf',
    fileSize: '950 KB',
    uploadedBy: 'Prof. Ananya Roy',
    lecturerRole: 'Lead Instructor',
    uploadedAt: 'Sep 20, 2024',
    downloadCount: 310,
    pinned: false,
    tags: ['Tailwind CSS', 'Cheatsheet', 'Tokens', 'Design'],
    previewContent: `NEO-BRUTALIST DESIGN TOKENS QUICK REFERENCE
Compiled for KL University UI Engineering Track

BORDERS & SHADOWS:
- Solid Border: border-2 border-black dark:border-white/10
- Thick Border: border-3 border-black
- Hard Drop Shadow: shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
- Small Sticker Shadow: shadow-[2px_2px_0px_0px_#000]
- Hover Interaction: hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5

VIBRANT PALETTE ACCENTS:
- Electric Pink: #FF1053 (brand-pink)
- School Bus Yellow: #FFD166 (brand-yellow)
- Cyber Blue: #00B4D8 (brand-blue)
- Toxic Green: #06D6A0 (brand-green)
- Electric Purple: #8338EC (brand-purple)
- Blaze Orange: #FF7B00 (brand-orange)`
  },
  {
    id: 'res-5',
    courseId: 'c-db',
    courseCode: '25CS1302E',
    courseName: 'Database Systems & Distributed Backend Dev',
    title: 'Mid-Term 1 Previous Question Papers with Model Solutions (2022-2024)',
    description: 'Solved examination papers covering relational algebra, normalization up to BCNF, B+ Tree index structures, and SQL query optimization.',
    unit: 'Unit 1 & 2',
    category: 'Previous Papers',
    fileType: 'pdf',
    fileName: 'DBMS_Mid1_Solved_Papers_2022_2024.pdf',
    fileSize: '5.6 MB',
    uploadedBy: 'Dr. Rajesh Sharma',
    lecturerRole: 'Course Faculty',
    uploadedAt: 'Sep 25, 2024',
    downloadCount: 285,
    pinned: true,
    tags: ['Question Paper', 'Solutions', 'Mid Exams', 'BCNF'],
    previewContent: `KL UNIVERSITY - SEMESTER MID-TERM 1 QUESTION BANK
SUBJECT: 25CS1302E - Database Systems Engineering

Q1: (8 Marks) Prove whether the relation R(A, B, C, D, E) with Functional Dependencies:
F = { A -> BC, CD -> E, B -> D, E -> A } is in BCNF or 3NF.
SOLUTION OUTLINE:
Candidate Keys: Compute closures for attributes.
(A)+ = {A, B, C, D, E} -> A is candidate key.
(E)+ = {E, A, B, C, D} -> E is candidate key.
(CD)+ = {C, D, E, A, B} -> CD is candidate key.
(BC)+ = {B, C, D, E, A} -> BC is candidate key.
Check FD B -> D:
- B is not a superkey.
- D is a prime attribute (part of candidate key CD).
Therefore, relation violates BCNF but satisfies 3NF!`
  },
  {
    id: 'res-6',
    courseId: 'c-ai',
    courseCode: '25SC1306E',
    courseName: 'Computational Foundations for Artificial Intelligence',
    title: 'Lecture 12: Singular Value Decomposition (SVD) & Eigenvectors in Python',
    description: 'Jupyter notebook and PDF derivation of SVD, low-rank matrix approximations, and latent semantic indexing in natural language processing.',
    unit: 'Unit 1',
    category: 'Lecture Notes',
    fileType: 'pdf',
    fileName: 'AI_Unit1_SVD_Dimensionality_Reduction.pdf',
    fileSize: '3.4 MB',
    uploadedBy: 'Dr. K. Venkatesh',
    lecturerRole: 'Assistant Professor',
    uploadedAt: 'Sep 22, 2024',
    downloadCount: 164,
    pinned: false,
    tags: ['Linear Algebra', 'SVD', 'Python', 'ML Foundations'],
    previewContent: `COMPUTATIONAL FOUNDATIONS FOR AI - UNIT 1: SVD
Instructor: Dr. K. Venkatesh

1. MATRIX FACTORIZATION:
Any real matrix A of dimensions m x n can be decomposed into:
A = U * Sigma * V^T
Where:
- U is an m x m orthogonal matrix (Left singular vectors, eigenvectors of A * A^T)
- Sigma is an m x n rectangular diagonal matrix with non-negative real numbers on the diagonal (singular values)
- V is an n x n orthogonal matrix (Right singular vectors, eigenvectors of A^T * A)

2. LOW-RANK APPROXIMATION (ECKART-YOUNG THEOREM):
The best rank-k approximation A_k that minimizes Frobenius norm ||A - A_k||_F is given by retaining the top k singular values and zeroing out the rest.

3. APPLICATIONS IN AI:
- Principal Component Analysis (PCA)
- Image Compression
- Latent Semantic Analysis (LSA) in Information Retrieval`
  },
  {
    id: 'res-7',
    courseId: 'c-dld',
    courseCode: '25EC2101E',
    courseName: 'Digital Design and Computer Architecture',
    title: 'RISC-V 32-bit Single-Cycle CPU Architecture Schematic & Opcode Map',
    description: 'Detailed high-resolution architectural diagram illustrating 32-bit RV32I datapath, ALU control decoders, immediate generators, and register file schematics.',
    unit: 'Unit 3',
    category: 'Reference Material',
    fileType: 'pdf',
    fileName: 'RISCV_RV32I_Datapath_Schematic_Color.pdf',
    fileSize: '6.1 MB',
    uploadedBy: 'Dr. Sunita Patil',
    lecturerRole: 'Course Faculty',
    uploadedAt: 'Sep 18, 2024',
    downloadCount: 175,
    pinned: false,
    tags: ['RISC-V', 'Datapath', 'Hardware', 'Architecture'],
    previewContent: `RISC-V RV32I BASE INTEGER INSTRUCTION SET SUMMARY
Department of Electronics & Computer Engineering

INSTRUCTION FORMATS:
1. R-Type (Register-Register): funct7 (7) | rs2 (5) | rs1 (5) | funct3 (3) | rd (5) | opcode (7)
   Examples: ADD, SUB, SLL, SLT, XOR, SRL, SRA, OR, AND
2. I-Type (Immediate/Load): imm[11:0] (12) | rs1 (5) | funct3 (3) | rd (5) | opcode (7)
   Examples: ADDI, SLTI, ANDI, ORI, XORI, LW, JALR
3. S-Type (Store): imm[11:5] (7) | rs2 (5) | rs1 (5) | funct3 (3) | imm[4:0] (5) | opcode (7)
   Examples: SW, SH, SB
4. B-Type (Conditional Branch): imm[12|10:5] | rs2 | rs1 | funct3 | imm[4:1|11] | opcode
   Examples: BEQ, BNE, BLT, BGE`
  }
];

export const INITIAL_ASSIGNMENTS: LMSAssignment[] = [
  {
    id: 'asg-1',
    courseId: 'c-dsa',
    courseCode: '25SC1204E',
    courseName: 'Data Structures and Algorithms - 1',
    title: 'Assignment 3: Implement Self-Balancing AVL Tree with Deletion Operations',
    description: 'Write a complete C++ or Java program that implements an AVL tree. Your code must support insert(), deleteNode(), search(), printLevelOrder(), and verifyBalanceFactor(). Ensure all rotation edge cases are thoroughly handled. Submit zipped source code and benchmark test output.',
    dueDate: 'Oct 08, 2024 11:59 PM',
    maxMarks: 20,
    unit: 'Unit 3',
    createdBy: 'Dr. Rajesh Sharma',
    createdAt: 'Sep 25, 2024',
    attachments: [
      { name: 'AVL_Tree_Test_Bench_Cases.pdf', size: '420 KB', type: 'pdf' },
      { name: 'AVL_Starter_Skeleton.cpp', size: '12 KB', type: 'code' }
    ],
    submissionsCount: 48,
    status: 'active',
    submissions: [
      {
        id: 'sub-1',
        assignmentId: 'asg-1',
        studentId: '2300030114',
        studentName: 'Siddharth Reddy',
        submittedAt: 'Sep 29, 2024 08:15 PM',
        fileName: '2300030114_AVL_Tree_Solution.cpp',
        fileSize: '18 KB',
        remarks: 'Implemented with recursive deletion and balance factor maintenance. All 5 test cases passing.',
        grade: 19,
        maxMarks: 20,
        feedback: 'Excellent clean implementation! Well-commented rotation logic and memory cleanup in destructor.',
        status: 'graded'
      }
    ]
  },
  {
    id: 'asg-2',
    courseId: 'c-ui',
    courseCode: '25CS1201E',
    courseName: 'Front End Development Frameworks & UI Engineering',
    title: 'Mini-Project 2: Build a Reactive Neo-Brutalist Micro-App with Tailwind & State',
    description: 'Create a responsive web component adhering to neo-brutalist aesthetics (bold 2px/3px borders, hard shadows, vibrant accents). Must use state management (Zustand or Context), accessibility attributes, and motion animations.',
    dueDate: 'Oct 12, 2024 11:59 PM',
    maxMarks: 25,
    unit: 'Unit 4',
    createdBy: 'Prof. Ananya Roy',
    createdAt: 'Sep 28, 2024',
    attachments: [
      { name: 'UI_Project_Rubric_Specifications.pdf', size: '890 KB', type: 'pdf' }
    ],
    submissionsCount: 32,
    status: 'active',
    submissions: []
  },
  {
    id: 'asg-3',
    courseId: 'c-db',
    courseCode: '25CS1302E',
    courseName: 'Database Systems & Distributed Backend Dev',
    title: 'Lab Exercise 5: Complex Analytical SQL Queries & Query Plan Profiling',
    description: 'Execute window functions (ROW_NUMBER, DENSE_RANK, NTILE) over a 500,000-row e-commerce dataset. Generate EXPLAIN ANALYZE comparison before and after composite B-Tree indexing.',
    dueDate: 'Oct 15, 2024 05:00 PM',
    maxMarks: 15,
    unit: 'Unit 2',
    createdBy: 'Dr. Rajesh Sharma',
    createdAt: 'Sep 29, 2024',
    attachments: [
      { name: 'Ecommerce_Sample_Schema.sql', size: '4.8 MB', type: 'code' }
    ],
    submissionsCount: 19,
    status: 'active',
    submissions: []
  }
];

export const INITIAL_ANNOUNCEMENTS: LMSAnnouncement[] = [
  {
    id: 'ann-1',
    courseId: 'c-dsa',
    courseCode: '25SC1204E',
    courseName: 'Data Structures and Algorithms - 1',
    title: 'Mid-Semester Examination Schedule & Blueprint Released',
    content: 'Dear Students, the Mid-Semester 1 Examination for 25SC1204E will be held on October 14, 2024 at 10:00 AM in Exam Hall 3. Syllabus includes Units 1, 2 and 3 (up to AVL trees). Review previous year papers in the course materials repository.',
    author: 'Dr. Rajesh Sharma',
    authorRole: 'Course Faculty',
    authorAvatar: 'RS',
    date: 'Sep 29, 2024',
    priority: 'urgent',
    attachment: {
      name: 'Mid1_Exam_Seat_Allotment.pdf',
      size: '1.2 MB'
    }
  },
  {
    id: 'ann-2',
    courseId: 'c-ui',
    courseCode: '25CS1201E',
    courseName: 'Front End Development Frameworks & UI Engineering',
    title: 'Guest Lecture: Modern Web Performance & Edge Runtimes with Vercel Engineer',
    content: 'We are excited to host a live virtual guest lecture with an engineering team lead on Friday at 3:00 PM in Seminar Hall 1. Attendance is mandatory for all enrolled students.',
    author: 'Prof. Ananya Roy',
    authorRole: 'Associate Professor',
    authorAvatar: 'AR',
    date: 'Sep 27, 2024',
    priority: 'important'
  },
  {
    id: 'ann-3',
    title: 'Department Notice: Semester Project Expo & Hackathon Registration Open',
    content: 'Registrations are open for the Annual KLU CodeCraft Expo. Teams can consist of 2 to 4 members. Submit your project abstracts before October 20.',
    author: 'CSE Academic Council',
    authorRole: 'Department Notice',
    authorAvatar: 'KLU',
    date: 'Sep 24, 2024',
    priority: 'general'
  }
];

export const INITIAL_DISCUSSIONS: LMSDiscussion[] = [
  {
    id: 'disc-1',
    courseId: 'c-dsa',
    courseCode: '25SC1204E',
    title: 'Doubt regarding Double Rotations in AVL Tree during left-heavy balance',
    content: 'In LR rotation, when we perform a left rotation on the left child followed by right rotation on the root, what happens to the right subtree of the child? Does it become the left subtree of the root?',
    author: 'Siddharth Reddy',
    authorRole: 'student',
    createdAt: '2 days ago',
    tags: ['AVL Trees', 'Rotations', 'Unit 3'],
    resolved: true,
    replies: [
      {
        id: 'rep-1',
        author: 'Dr. Rajesh Sharma',
        authorRole: 'lecturer',
        content: 'Yes Siddharth, exactly! In an LR rotation, the right child of the left child (let us call it node C) becomes the new root of this 3-node subtree. Its left subtree becomes the right child of node A, and its right subtree becomes the left child of node B. Review Slide 14 of the AVL Tree handbook for the visual step-by-step diagram.',
        createdAt: '1 day ago'
      }
    ]
  },
  {
    id: 'disc-2',
    courseId: 'c-ui',
    courseCode: '25CS1201E',
    title: 'How does React 19 useOptimistic handle rejected network promises?',
    content: 'If the server action throws an error or fails validation, how does React rollback the optimistic UI state? Do we need manual try-catch wrappers?',
    author: 'Rahul Verma',
    authorRole: 'student',
    createdAt: 'Yesterday',
    tags: ['React 19', 'useOptimistic', 'Actions'],
    resolved: false,
    replies: [
      {
        id: 'rep-2',
        author: 'Prof. Ananya Roy',
        authorRole: 'lecturer',
        content: 'React automatically discards the optimistic value and reverts to the current resolved server state as soon as the transition promise rejects or settles! However, for user-friendly error banners, you should capture the error state via useActionState or error boundaries.',
        createdAt: '4 hours ago'
      }
    ]
  }
];
