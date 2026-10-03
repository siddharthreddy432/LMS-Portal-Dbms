export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  courseCode: string;
  att: number;
  sub: string;
  cgpa: string;
  section: string;
  advisor: string;
  status: string;
  phone?: string;
  bloodGroup?: string;
  batch?: string;
  ltps: {
    L: string;
    L_attended: number;
    L_total: number;
    T: string;
    T_attended: number;
    T_total: number;
    P: string;
    P_attended: number;
    P_total: number;
    S: string;
    S_attended: number;
    S_total: number;
  };
  assignments: Array<{
    id: string;
    title: string;
    score: string;
    maxScore: string;
    status: 'Graded' | 'Submitted' | 'Late';
    date: string;
    feedback?: string;
  }>;
  recentSessions: Array<{
    date: string;
    type: 'Lecture' | 'Lab' | 'Tutorial' | 'Skilling';
    topic: string;
    status: 'Present' | 'Absent' | 'On Duty';
    time: string;
    room: string;
  }>;
}

export const STUDENT_COHORT_RECORDS: StudentRecord[] = [
  {
    id: '2300030114',
    name: 'Siddharth Reddy',
    email: 'siddharthreddy432@gmail.com',
    course: '25SC1204E Data Structures & Algorithms',
    courseCode: '25SC1204E',
    att: 88.5,
    sub: '3/3',
    cgpa: '9.42',
    section: 'Section S14',
    advisor: 'Dr. K. V. Ramanathan',
    status: 'Good Academic Standing',
    phone: '+91 98480 22338',
    bloodGroup: 'O+',
    batch: 'B.Tech CSE 2023-2027',
    ltps: {
      L: '24/26 (92%)',
      L_attended: 24,
      L_total: 26,
      T: '8/10 (80%)',
      T_attended: 8,
      T_total: 10,
      P: '12/14 (86%)',
      P_attended: 12,
      P_total: 14,
      S: '8/8 (100%)',
      S_attended: 8,
      S_total: 8
    },
    assignments: [
      {
        id: 'asg-1',
        title: 'Assignment 1: AVL & Self-Balancing Trees',
        score: '19',
        maxScore: '20',
        status: 'Graded',
        date: '12 Feb 2026',
        feedback: 'Excellent rotation invariants and complexity proofs.'
      },
      {
        id: 'asg-2',
        title: 'Assignment 2: Red-Black Trees & Binary Heaps',
        score: '18',
        maxScore: '20',
        status: 'Graded',
        date: '28 Feb 2026',
        feedback: 'Clean color flip logic; minor test case boundary issue.'
      },
      {
        id: 'asg-3',
        title: 'Assignment 3: Graph Traversal & Dijkstra MST',
        score: 'Pending',
        maxScore: '20',
        status: 'Submitted',
        date: '18 Mar 2026',
        feedback: 'Awaiting faculty code evaluation.'
      }
    ],
    recentSessions: [
      { date: '28 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'Graph Shortest Paths & Dijkstra Proofs', status: 'Present', room: 'LH 201' },
      { date: '26 Sep 2026', time: '01:30 - 03:10 PM', type: 'Lab', topic: 'C++ Implementation of Adjacency Lists', status: 'Present', room: 'Comp Lab 4' },
      { date: '24 Sep 2026', time: '11:00 - 11:50 AM', type: 'Tutorial', topic: 'Dynamic Programming Practice Set', status: 'Present', room: 'LH 104' },
      { date: '22 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'Bellman-Ford Algorithm Invariants', status: 'Absent', room: 'LH 201' },
      { date: '19 Sep 2026', time: '02:00 - 03:40 PM', type: 'Lecture', topic: 'Floyd-Warshall All Pairs Shortest', status: 'Present', room: 'LH 201' },
      { date: '17 Sep 2026', time: '01:30 - 03:10 PM', type: 'Lab', topic: 'Minimum Spanning Trees: Prim vs Kruskal', status: 'Present', room: 'Comp Lab 4' },
      { date: '15 Sep 2026', time: '10:00 - 11:40 AM', type: 'Skilling', topic: 'Competitive Coding Tree Rotations', status: 'Present', room: 'Innovation Hub' }
    ]
  },
  {
    id: '2300030219',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@kluniversity.in',
    course: '25SC1204E Data Structures & Algorithms',
    courseCode: '25SC1204E',
    att: 91.2,
    sub: '3/3',
    cgpa: '9.65',
    section: 'Section S14',
    advisor: 'Dr. K. V. Ramanathan',
    status: 'Exemplary Standing',
    phone: '+91 97001 88291',
    bloodGroup: 'B+',
    batch: 'B.Tech CSE 2023-2027',
    ltps: {
      L: '25/26 (96%)',
      L_attended: 25,
      L_total: 26,
      T: '9/10 (90%)',
      T_attended: 9,
      T_total: 10,
      P: '13/14 (93%)',
      P_attended: 13,
      P_total: 14,
      S: '8/8 (100%)',
      S_attended: 8,
      S_total: 8
    },
    assignments: [
      { id: 'asg-1', title: 'Assignment 1: AVL & Self-Balancing Trees', score: '20', maxScore: '20', status: 'Graded', date: '11 Feb 2026', feedback: 'Perfect submission.' },
      { id: 'asg-2', title: 'Assignment 2: Red-Black Trees & Binary Heaps', score: '20', maxScore: '20', status: 'Graded', date: '27 Feb 2026', feedback: 'Outstanding efficiency.' },
      { id: 'asg-3', title: 'Assignment 3: Graph Traversal & Dijkstra MST', score: '19', maxScore: '20', status: 'Graded', date: '17 Mar 2026', feedback: 'Well structured.' }
    ],
    recentSessions: [
      { date: '28 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'Graph Shortest Paths & Dijkstra Proofs', status: 'Present', room: 'LH 201' },
      { date: '26 Sep 2026', time: '01:30 - 03:10 PM', type: 'Lab', topic: 'C++ Implementation of Adjacency Lists', status: 'Present', room: 'Comp Lab 4' },
      { date: '24 Sep 2026', time: '11:00 - 11:50 AM', type: 'Tutorial', topic: 'Dynamic Programming Practice Set', status: 'Present', room: 'LH 104' },
      { date: '22 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'Bellman-Ford Algorithm Invariants', status: 'Present', room: 'LH 201' },
      { date: '19 Sep 2026', time: '02:00 - 03:40 PM', type: 'Lecture', topic: 'Floyd-Warshall All Pairs Shortest', status: 'Present', room: 'LH 201' }
    ]
  },
  {
    id: '2300030388',
    name: 'Rahul Verma',
    email: 'rahul.verma@kluniversity.in',
    course: '25CS1201E UI Engineering & Architecture',
    courseCode: '25CS1201E',
    att: 76.0,
    sub: '2/3',
    cgpa: '8.20',
    section: 'Section S08',
    advisor: 'Prof. Suresh Babu',
    status: 'Attendance Warning (Near 75% Cutoff)',
    phone: '+91 94401 55672',
    bloodGroup: 'A+',
    batch: 'B.Tech CSE 2023-2027',
    ltps: {
      L: '19/26 (73%)',
      L_attended: 19,
      L_total: 26,
      T: '8/10 (80%)',
      T_attended: 8,
      T_total: 10,
      P: '11/14 (78%)',
      P_attended: 11,
      P_total: 14,
      S: '6/8 (75%)',
      S_attended: 6,
      S_total: 8
    },
    assignments: [
      { id: 'asg-1', title: 'Lab Assessment 1: CSS Grid & Responsive Canvas', score: '17', maxScore: '20', status: 'Graded', date: '15 Feb 2026', feedback: 'Good responsive breakdown.' },
      { id: 'asg-2', title: 'Lab Assessment 2: Component State & Custom Hooks', score: '16', maxScore: '20', status: 'Graded', date: '02 Mar 2026', feedback: 'State synchronization needs attention.' },
      { id: 'asg-3', title: 'Mini Project: Full-Stack React 19 Dashboard', score: 'Overdue', maxScore: '20', status: 'Late', date: '20 Mar 2026', feedback: 'Pending submission.' }
    ],
    recentSessions: [
      { date: '29 Sep 2026', time: '10:00 - 11:40 AM', type: 'Lecture', topic: 'Tailwind CSS v4 Engine Deep Dive', status: 'Present', room: 'LH 304' },
      { date: '27 Sep 2026', time: '02:00 - 03:40 PM', type: 'Lab', topic: 'Responsive Flexbox Grid Practical', status: 'Absent', room: 'UI Lab Block B' },
      { date: '25 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'React 19 Server Components', status: 'Present', room: 'LH 304' },
      { date: '22 Sep 2026', time: '11:00 - 11:50 AM', type: 'Tutorial', topic: 'State Machine Architecture', status: 'Absent', room: 'LH 102' },
      { date: '20 Sep 2026', time: '01:30 - 03:10 PM', type: 'Lecture', topic: 'Web Accessibility Guidelines', status: 'Present', room: 'LH 304' }
    ]
  },
  {
    id: '2300030452',
    name: 'Preeti Deshmukh',
    email: 'preeti.deshmukh@kluniversity.in',
    course: '25CS1302E Database Systems & Warehousing',
    courseCode: '25CS1302E',
    att: 84.0,
    sub: '3/3',
    cgpa: '8.88',
    section: 'Section S02',
    advisor: 'Dr. M. Lakshmi',
    status: 'Good Academic Standing',
    phone: '+91 96180 77441',
    bloodGroup: 'AB+',
    batch: 'B.Tech CSE 2023-2027',
    ltps: {
      L: '22/26 (84%)',
      L_attended: 22,
      L_total: 26,
      T: '9/10 (90%)',
      T_attended: 9,
      T_total: 10,
      P: '12/14 (86%)',
      P_attended: 12,
      P_total: 14,
      S: '7/8 (87%)',
      S_attended: 7,
      S_total: 8
    },
    assignments: [
      { id: 'asg-1', title: 'Assignment 1: Relational Algebra & SQL DDL', score: '18', maxScore: '20', status: 'Graded', date: '10 Feb 2026', feedback: 'Great query optimization.' },
      { id: 'asg-2', title: 'Assignment 2: B+ Tree Indexing & 3NF Decompositions', score: '19', maxScore: '20', status: 'Graded', date: '26 Feb 2026', feedback: 'Precise normal forms.' },
      { id: 'asg-3', title: 'Assignment 3: Concurrency Control & Two-Phase Locking', score: 'Pending', maxScore: '20', status: 'Submitted', date: '15 Mar 2026', feedback: 'Under review.' }
    ],
    recentSessions: [
      { date: '30 Sep 2026', time: '10:00 - 11:40 AM', type: 'Lecture', topic: 'Query Optimization & Hash Joins', status: 'Present', room: 'LH 302' },
      { date: '28 Sep 2026', time: '01:30 - 03:10 PM', type: 'Lab', topic: 'PostgreSQL Indexing & Explain Analyze', status: 'Present', room: 'DB Lab A' },
      { date: '25 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'ACID Transactions & WAL Logs', status: 'Present', room: 'LH 302' },
      { date: '23 Sep 2026', time: '11:00 - 11:50 AM', type: 'Tutorial', topic: 'BCNF Normalization Invariants', status: 'Present', room: 'LH 101' },
      { date: '21 Sep 2026', time: '02:00 - 03:40 PM', type: 'Lecture', topic: 'Deadlock Detection Algorithms', status: 'Absent', room: 'LH 302' }
    ]
  },
  {
    id: '2300030510',
    name: 'Aditya Rao',
    email: 'aditya.rao@kluniversity.in',
    course: '25SC1306E Artificial Intelligence Foundations',
    courseCode: '25SC1306E',
    att: 71.5,
    sub: '1/3',
    cgpa: '7.85',
    section: 'Section S11',
    advisor: 'Dr. K. V. Ramanathan',
    status: 'Condonation Fee Required (<75%)',
    phone: '+91 98850 11922',
    bloodGroup: 'O-',
    batch: 'B.Tech CSE 2023-2027',
    ltps: {
      L: '18/26 (69%)',
      L_attended: 18,
      L_total: 26,
      T: '7/10 (70%)',
      T_attended: 7,
      T_total: 10,
      P: '10/14 (71%)',
      P_attended: 10,
      P_total: 14,
      S: '6/8 (75%)',
      S_attended: 6,
      S_total: 8
    },
    assignments: [
      { id: 'asg-1', title: 'Assignment 1: Search Algorithms A* & IDA*', score: '15', maxScore: '20', status: 'Graded', date: '14 Feb 2026', feedback: 'Heuristic function lacks admissibility.' },
      { id: 'asg-2', title: 'Assignment 2: Minimax & Alpha-Beta Pruning', score: 'Pending', maxScore: '20', status: 'Submitted', date: '01 Mar 2026', feedback: 'Evaluation pending.' },
      { id: 'asg-3', title: 'Assignment 3: Markov Decision Processes (MDP)', score: 'Missing', maxScore: '20', status: 'Late', date: '19 Mar 2026', feedback: 'Deadline passed.' }
    ],
    recentSessions: [
      { date: '29 Sep 2026', time: '11:00 - 12:40 PM', type: 'Lecture', topic: 'Reinforcement Learning Q-Learning', status: 'Absent', room: 'LH 105' },
      { date: '27 Sep 2026', time: '02:00 - 03:40 PM', type: 'Lab', topic: 'PyTorch Linear Regression Lab', status: 'Present', room: 'AI Lab Block C' },
      { date: '24 Sep 2026', time: '09:00 - 10:40 AM', type: 'Lecture', topic: 'Convolutional Neural Networks', status: 'Absent', room: 'LH 105' },
      { date: '22 Sep 2026', time: '01:30 - 02:20 PM', type: 'Tutorial', topic: 'Probability & Bayes Theorem', status: 'Present', room: 'LH 102' },
      { date: '20 Sep 2026', time: '11:00 - 12:40 PM', type: 'Lecture', topic: 'Gradient Descent Optimization', status: 'Absent', room: 'LH 105' }
    ]
  }
];
