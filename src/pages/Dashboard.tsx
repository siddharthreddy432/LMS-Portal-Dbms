import { safeStorage } from '../utils/storage';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { calculateLTPSProjections, LTPS_WEIGHTS, calculateLTPS, calculateAttendanceStatus } from "../lib/attendance";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, MoreHorizontal, Loader2, LogOut, Table, X, Search, Settings2, GripHorizontal, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SessionExpiredModal from '../components/SessionExpiredModal';
import SyncStatus from '../components/SyncStatus';

const COURSE_MAP: Record<string, string> = {
 '25UC1203E': 'Design Thinking For Innovation',
 '25UC1203E-P': 'Design Thinking For Innovation - Practical',
 '25UC1203E-L': 'Design Thinking For Innovation - Lecture',
 '25UC1203E-S': 'Design Thinking For Innovation - Skilling',
 '25UC1102E': 'Language Skills For Engineers',
 '25UC1102E-P': 'Language Skills For Engineers - Practical',
 '25UC1102E-L': 'Language Skills For Engineers - Lecture',
 '25UC1102E-S': 'Language Skills For Engineers - Skilling',
 '25MT1002E': 'Discrete Mathematics',
 '25MT1002E-P': 'Discrete Mathematics - Practical',
 '25MT1002E-L': 'Discrete Mathematics - Lecture',
 '25MT1002E-S': 'Discrete Mathematics - Skilling',
 '25SC1105E': 'Problem Solving Through Programming (Java)',
 '25SC1105E-P': 'Problem Solving Through Programming (Java) - Practical',
 '25SC1105E-L': 'Problem Solving Through Programming (Java) - Lecture',
 '25SC1105E-S': 'Problem Solving Through Programming (Java) - Skilling',
 '25SC1104E': 'Fundamentals Of Web Development',
 '25SC1104E-P': 'Fundamentals Of Web Development - Practical',
 '25SC1104E-L': 'Fundamentals Of Web Development - Lecture',
 '25SC1104E-S': 'Fundamentals Of Web Development - Skilling',
 '25UC1204E': 'Communication Skills For Engineers',
 '25UC1204E-P': 'Communication Skills For Engineers - Practical',
 '25UC1204E-L': 'Communication Skills For Engineers - Lecture',
 '25UC1204E-S': 'Communication Skills For Engineers - Skilling',
 '25MT1205E': 'Mathematics For Ai',
 '25MT1205E-P': 'Mathematics For Ai - Practical',
 '25MT1205E-L': 'Mathematics For Ai - Lecture',
 '25MT1205E-S': 'Mathematics For Ai - Skilling',
 '25SC1204E': 'Data Structures And Algorithms - 1',
 '25SC1204E-P': 'Data Structures And Algorithms - 1 - Practical',
 '25SC1204E-L': 'Data Structures And Algorithms - 1 - Lecture',
 '25SC1204E-S': 'Data Structures And Algorithms - 1 - Skilling',
 '25CS1201E': 'Front End Development Frameworks And Ui Engineering',
 '25CS1201E-P': 'Front End Development Frameworks And Ui Engineering - Practical',
 '25CS1201E-L': 'Front End Development Frameworks And Ui Engineering - Lecture',
 '25CS1201E-S': 'Front End Development Frameworks And Ui Engineering - Skilling',
 '25EC2101E': 'Digital Design And Computer Architecture',
 '25EC2101E-P': 'Digital Design And Computer Architecture - Practical',
 '25EC2101E-L': 'Digital Design And Computer Architecture - Lecture',
 '25EC2101E-S': 'Digital Design And Computer Architecture - Skilling',
 'FLP-1': 'Foreign Language Proficiency - 1',
 'FLP-1-P': 'Foreign Language Proficiency - 1 - Practical',
 'FLP-1-L': 'Foreign Language Proficiency - 1 - Lecture',
 'FLP-1-S': 'Foreign Language Proficiency - 1 - Skilling',
 '25MT1306E': 'Mathematics For Data Science And Analytics',
 '25MT1306E-P': 'Mathematics For Data Science And Analytics - Practical',
 '25MT1306E-L': 'Mathematics For Data Science And Analytics - Lecture',
 '25MT1306E-S': 'Mathematics For Data Science And Analytics - Skilling',
 '25SC1306E': 'Computational Foundations For Artificial Intelligence',
 '25SC1306E-P': 'Computational Foundations For Artificial Intelligence - Practical',
 '25SC1306E-L': 'Computational Foundations For Artificial Intelligence - Lecture',
 '25SC1306E-S': 'Computational Foundations For Artificial Intelligence - Skilling',
 '25SC1305E': 'Data Structures And Algorithms - 2',
 '25SC1305E-P': 'Data Structures And Algorithms - 2 - Practical',
 '25SC1305E-L': 'Data Structures And Algorithms - 2 - Lecture',
 '25SC1305E-S': 'Data Structures And Algorithms - 2 - Skilling',
 '25CS1302E': 'Database Systems Engineering And Distributed Backend Development',
 '25CS1302E-P': 'Database Systems Engineering And Distributed Backend Development - Practical',
 '25CS1302E-L': 'Database Systems Engineering And Distributed Backend Development - Lecture',
 '25CS1302E-S': 'Database Systems Engineering And Distributed Backend Development - Skilling',
 '25IE2040E': 'Social Internship',
 '25IE2040E-P': 'Social Internship - Practical',
 '25IE2040E-L': 'Social Internship - Lecture',
 '25IE2040E-S': 'Social Internship - Skilling',
 '25UC0032E': 'Insights To Sustainable Development Goals',
 '25UC0032E-P': 'Insights To Sustainable Development Goals - Practical',
 '25UC0032E-L': 'Insights To Sustainable Development Goals - Lecture',
 '25UC0032E-S': 'Insights To Sustainable Development Goals - Skilling',
 '25CS2103E': 'Data Structures And Algorithms - 3',
 '25CS2103E-P': 'Data Structures And Algorithms - 3 - Practical',
 '25CS2103E-L': 'Data Structures And Algorithms - 3 - Lecture',
 '25CS2103E-S': 'Data Structures And Algorithms - 3 - Skilling',
 '25EC2206E': 'Embedded System Design And Iot',
 '25EC2206E-P': 'Embedded System Design And Iot - Practical',
 '25EC2206E-L': 'Embedded System Design And Iot - Lecture',
 '25EC2206E-S': 'Embedded System Design And Iot - Skilling',
 '25SC2107E': 'Machine Learning',
 '25SC2107E-P': 'Machine Learning - Practical',
 '25SC2107E-L': 'Machine Learning - Lecture',
 '25SC2107E-S': 'Machine Learning - Skilling',
 '25CS2104E': 'Operating Systems And Systems Programming',
 '25CS2104E-P': 'Operating Systems And Systems Programming - Practical',
 '25CS2104E-L': 'Operating Systems And Systems Programming - Lecture',
 '25CS2104E-S': 'Operating Systems And Systems Programming - Skilling',
 'FLP-2': 'Foreign Language Proficiency - 2',
 'FLP-2-P': 'Foreign Language Proficiency - 2 - Practical',
 'FLP-2-L': 'Foreign Language Proficiency - 2 - Lecture',
 'FLP-2-S': 'Foreign Language Proficiency - 2 - Skilling',
 '25CS2205E': 'Advanced Object Oriented Programming',
 '25CS2205E-P': 'Advanced Object Oriented Programming - Practical',
 '25CS2205E-L': 'Advanced Object Oriented Programming - Lecture',
 '25CS2205E-S': 'Advanced Object Oriented Programming - Skilling',
 '25CS2206E': 'Cloud Infrastructure And Services',
 '25CS2206E-P': 'Cloud Infrastructure And Services - Practical',
 '25CS2206E-L': 'Cloud Infrastructure And Services - Lecture',
 '25CS2206E-S': 'Cloud Infrastructure And Services - Skilling',
 '25CS2208E': 'Computer Networks And Network Programming',
 '25CS2208E-P': 'Computer Networks And Network Programming - Practical',
 '25CS2208E-L': 'Computer Networks And Network Programming - Lecture',
 '25CS2208E-S': 'Computer Networks And Network Programming - Skilling',
 '25CS2207E': 'Generative Ai And Ai Platform Engineering',
 '25CS2207E-P': 'Generative Ai And Ai Platform Engineering - Practical',
 '25CS2207E-L': 'Generative Ai And Ai Platform Engineering - Lecture',
 '25CS2207E-S': 'Generative Ai And Ai Platform Engineering - Skilling',
 'VAC-1': 'Value Added Course 1 - Sports',
 '25SP2104': 'Sports',
 '25FL2111E': 'Foreign Language',
 'VAC-1-P': 'Value Added Course 1 - Sports - Practical',
 'VAC-1-L': 'Value Added Course 1 - Sports - Lecture',
 'VAC-1-S': 'Value Added Course 1 - Sports - Skilling',
 '25CS2309E': 'Big Data Engineering And Data Pipelines',
 '25CS2309E-P': 'Big Data Engineering And Data Pipelines - Practical',
 '25CS2309E-L': 'Big Data Engineering And Data Pipelines - Lecture',
 '25CS2309E-S': 'Big Data Engineering And Data Pipelines - Skilling',
 '25CS2310E': 'Ci/Cd And Cloud Devops',
 '25CS2310E-P': 'Ci/Cd And Cloud Devops - Practical',
 '25CS2310E-L': 'Ci/Cd And Cloud Devops - Lecture',
 '25CS2310E-S': 'Ci/Cd And Cloud Devops - Skilling',
 '25EC2308E': 'Embedded Software Development',
 '25EC2308E-P': 'Embedded Software Development - Practical',
 '25EC2308E-L': 'Embedded Software Development - Lecture',
 '25EC2308E-S': 'Embedded Software Development - Skilling',
 '25CS2311E': 'System Design For Scalability And Reliability',
 '25CS2311E-P': 'System Design For Scalability And Reliability - Practical',
 '25CS2311E-L': 'System Design For Scalability And Reliability - Lecture',
 '25CS2311E-S': 'System Design For Scalability And Reliability - Skilling',
 'VAC-2': 'Value Added Course 2 - Technical Global Certification 1',
 'VAC-2-P': 'Value Added Course 2 - Technical Global Certification 1 - Practical',
 'VAC-2-L': 'Value Added Course 2 - Technical Global Certification 1 - Lecture',
 'VAC-2-S': 'Value Added Course 2 - Technical Global Certification 1 - Skilling',
 '25IE3041E': 'Technical Internship',
 '25IE3041E-P': 'Technical Internship - Practical',
 '25IE3041E-L': 'Technical Internship - Lecture',
 '25IE3041E-S': 'Technical Internship - Skilling',
 '25UC0017E': 'Indian Knowledge Systems',
 '25UC0017E-P': 'Indian Knowledge Systems - Practical',
 '25UC0017E-L': 'Indian Knowledge Systems - Lecture',
 '25UC0017E-S': 'Indian Knowledge Systems - Skilling',
 '25CS3112E': 'Deep Learning With Accelerated Computing',
 '25CS3112E-P': 'Deep Learning With Accelerated Computing - Practical',
 '25CS3112E-L': 'Deep Learning With Accelerated Computing - Lecture',
 '25CS3112E-S': 'Deep Learning With Accelerated Computing - Skilling',
 '25CS3113E': 'Embedded Ai And Tiny Ml',
 '25CS3113E-P': 'Embedded Ai And Tiny Ml - Practical',
 '25CS3113E-L': 'Embedded Ai And Tiny Ml - Lecture',
 '25CS3113E-S': 'Embedded Ai And Tiny Ml - Skilling',
 '25EC3111E': 'Foundations Of Robotics And Mechatronic Systems',
 '25EC3111E-P': 'Foundations Of Robotics And Mechatronic Systems - Practical',
 '25EC3111E-L': 'Foundations Of Robotics And Mechatronic Systems - Lecture',
 '25EC3111E-S': 'Foundations Of Robotics And Mechatronic Systems - Skilling',
 'PE-1': 'Professional Elective - 1',
 'PE-1-P': 'Professional Elective - 1 - Practical',
 'PE-1-L': 'Professional Elective - 1 - Lecture',
 'PE-1-S': 'Professional Elective - 1 - Skilling',
 'VAC-3': 'Value Added Course 3 - Technical Global Certification 2',
 'VAC-3-P': 'Value Added Course 3 - Technical Global Certification 2 - Practical',
 'VAC-3-L': 'Value Added Course 3 - Technical Global Certification 2 - Lecture',
 'VAC-3-S': 'Value Added Course 3 - Technical Global Certification 2 - Skilling',
 '25CS3214E': 'Natural Language Processing And Llm Engineering',
 '25CS3214E-P': 'Natural Language Processing And Llm Engineering - Practical',
 '25CS3214E-L': 'Natural Language Processing And Llm Engineering - Lecture',
 '25CS3214E-S': 'Natural Language Processing And Llm Engineering - Skilling',
 '25EC3214E': 'Robotic Perception, Computer Vision And Sensor Fusion',
 '25EC3214E-P': 'Robotic Perception, Computer Vision And Sensor Fusion - Practical',
 '25EC3214E-L': 'Robotic Perception, Computer Vision And Sensor Fusion - Lecture',
 '25EC3214E-S': 'Robotic Perception, Computer Vision And Sensor Fusion - Skilling',
 'PE-2': 'Professional Elective - 2',
 'PE-2-P': 'Professional Elective - 2 - Practical',
 'PE-2-L': 'Professional Elective - 2 - Lecture',
 'PE-2-S': 'Professional Elective - 2 - Skilling',
 'PE-3': 'Professional Elective - 3',
 'PE-3-P': 'Professional Elective - 3 - Practical',
 'PE-3-L': 'Professional Elective - 3 - Lecture',
 'PE-3-S': 'Professional Elective - 3 - Skilling',
 'VAC-4': 'Value Added Course 4 - Technical Global Certification 3',
 'VAC-4-P': 'Value Added Course 4 - Technical Global Certification 3 - Practical',
 'VAC-4-L': 'Value Added Course 4 - Technical Global Certification 3 - Lecture',
 'VAC-4-S': 'Value Added Course 4 - Technical Global Certification 3 - Skilling',
 '25CS3315E': 'Agentic Ai And Autonomous Enterprise Systems',
 '25CS3315E-P': 'Agentic Ai And Autonomous Enterprise Systems - Practical',
 '25CS3315E-L': 'Agentic Ai And Autonomous Enterprise Systems - Lecture',
 '25CS3315E-S': 'Agentic Ai And Autonomous Enterprise Systems - Skilling',
 '25EC3316E': 'Robotic Motion Planning, Navigation And Control Systems',
 '25EC3316E-P': 'Robotic Motion Planning, Navigation And Control Systems - Practical',
 '25EC3316E-L': 'Robotic Motion Planning, Navigation And Control Systems - Lecture',
 '25EC3316E-S': 'Robotic Motion Planning, Navigation And Control Systems - Skilling',
 'PE-4': 'Professional Elective - 4',
 'PE-4-P': 'Professional Elective - 4 - Practical',
 'PE-4-L': 'Professional Elective - 4 - Lecture',
 'PE-4-S': 'Professional Elective - 4 - Skilling',
 'PE-5': 'Professional Elective - 5',
 'PE-5-P': 'Professional Elective - 5 - Practical',
 'PE-5-L': 'Professional Elective - 5 - Lecture',
 'PE-5-S': 'Professional Elective - 5 - Skilling',
 'VAC-5': 'Value Added Course 5 - Technical Global Certification 4',
 'VAC-5-P': 'Value Added Course 5 - Technical Global Certification 4 - Practical',
 'VAC-5-L': 'Value Added Course 5 - Technical Global Certification 4 - Lecture',
 'VAC-5-S': 'Value Added Course 5 - Technical Global Certification 4 - Skilling',
 '25IE4042E': 'Research / Industrial Internship',
 '25IE4042E-P': 'Research / Industrial Internship - Practical',
 '25IE4042E-L': 'Research / Industrial Internship - Lecture',
 '25IE4042E-S': 'Research / Industrial Internship - Skilling',
 '25UC0009E': 'Ecology And Environment',
 '25UC0009E-P': 'Ecology And Environment - Practical',
 '25UC0009E-L': 'Ecology And Environment - Lecture',
 '25UC0009E-S': 'Ecology And Environment - Skilling',
 '25IE4101E': 'Term Paper',
 '25IE4101E-P': 'Term Paper - Practical',
 '25IE4101E-L': 'Term Paper - Lecture',
 '25IE4101E-S': 'Term Paper - Skilling',
 '25EC4117E': 'Autonomous Robotic Systems And Human-Robot Interaction',
 '25EC4117E-P': 'Autonomous Robotic Systems And Human-Robot Interaction - Practical',
 '25EC4117E-L': 'Autonomous Robotic Systems And Human-Robot Interaction - Lecture',
 '25EC4117E-S': 'Autonomous Robotic Systems And Human-Robot Interaction - Skilling',
 '25CS4117E': 'Adaptive Software Engineering',
 '25CS4117E-P': 'Adaptive Software Engineering - Practical',
 '25CS4117E-L': 'Adaptive Software Engineering - Lecture',
 '25CS4117E-S': 'Adaptive Software Engineering - Skilling',
 '25EC4119E': 'Agentic Embedded Systems And Intelligent Edge Orchestration',
 '25EC4119E-P': 'Agentic Embedded Systems And Intelligent Edge Orchestration - Practical',
 '25EC4119E-L': 'Agentic Embedded Systems And Intelligent Edge Orchestration - Lecture',
 '25EC4119E-S': 'Agentic Embedded Systems And Intelligent Edge Orchestration - Skilling',
 'OE': 'Open Elective',
 'OE-P': 'Open Elective - Practical',
 'OE-L': 'Open Elective - Lecture',
 'OE-S': 'Open Elective - Skilling',
 '25IE4053E': 'Capstone Project - 1',
 '25IE4053E-P': 'Capstone Project - 1 - Practical',
 '25IE4053E-L': 'Capstone Project - 1 - Lecture',
 '25IE4053E-S': 'Capstone Project - 1 - Skilling',
 'SE': 'Science Elective',
 'SE-P': 'Science Elective - Practical',
 'SE-L': 'Science Elective - Lecture',
 'SE-S': 'Science Elective - Skilling',
 '25UC0008E': 'Indian Constitution',
 '25UC0008E-P': 'Indian Constitution - Practical',
 '25UC0008E-L': 'Indian Constitution - Lecture',
 '25UC0008E-S': 'Indian Constitution - Skilling',
 'MGEL': 'Management Elective',
 'MGEL-P': 'Management Elective - Practical',
 'MGEL-L': 'Management Elective - Lecture',
 'MGEL-S': 'Management Elective - Skilling',
 '25IE4054E': 'Capstone Project - 2',
 '25IE4054E-P': 'Capstone Project - 2 - Practical',
 '25IE4054E-L': 'Capstone Project - 2 - Lecture',
 '25IE4054E-S': 'Capstone Project - 2 - Skilling',
 '25UC0026E': 'Human Values, Gender Equality & Professional Ethics',
 '25UC0026E-P': 'Human Values, Gender Equality & Professional Ethics - Practical',
 '25UC0026E-L': 'Human Values, Gender Equality & Professional Ethics - Lecture',
 '25UC0026E-S': 'Human Values, Gender Equality & Professional Ethics - Skilling',
 '25CI2201E': 'Enterprise Information Systems & Erp',
 '25CI2201E-P': 'Enterprise Information Systems & Erp - Practical',
 '25CI2201E-L': 'Enterprise Information Systems & Erp - Lecture',
 '25CI2201E-S': 'Enterprise Information Systems & Erp - Skilling',
 '25CI2302E': 'Cybersecurity & Information Assurance',
 '25CI2302E-P': 'Cybersecurity & Information Assurance - Practical',
 '25CI2302E-L': 'Cybersecurity & Information Assurance - Lecture',
 '25CI2302E-S': 'Cybersecurity & Information Assurance - Skilling',
 '25CI4103E': 'Adaptive Software Delivery & Devsecops',
 '25CI4103E-P': 'Adaptive Software Delivery & Devsecops - Practical',
 '25CI4103E-L': 'Adaptive Software Delivery & Devsecops - Lecture',
 '25CI4103E-S': 'Adaptive Software Delivery & Devsecops - Skilling',
 '25AD2203E': 'Data Warehousing & Mining',
 '25AD2203E-P': 'Data Warehousing & Mining - Practical',
 '25AD2203E-L': 'Data Warehousing & Mining - Lecture',
 '25AD2203E-S': 'Data Warehousing & Mining - Skilling',
 '25AD2204E': 'Federated Learning',
 '25AD2204E-P': 'Federated Learning - Practical',
 '25AD2204E-L': 'Federated Learning - Lecture',
 '25AD2204E-S': 'Federated Learning - Skilling',
 '25AD3105E': 'Reinforcement Learning & Decision Systems',
 '25AD3105E-P': 'Reinforcement Learning & Decision Systems - Practical',
 '25AD3105E-L': 'Reinforcement Learning & Decision Systems - Lecture',
 '25AD3105E-S': 'Reinforcement Learning & Decision Systems - Skilling',
 '25AD4106E': 'Production Ai Systems',
 '25AD4106E-P': 'Production Ai Systems - Practical',
 '25AD4106E-L': 'Production Ai Systems - Lecture',
 '25AD4106E-S': 'Production Ai Systems - Skilling',
 '25MT1307E': 'Mathematics For Communication Systems',
 '25MT1307E-P': 'Mathematics For Communication Systems - Practical',
 '25MT1307E-L': 'Mathematics For Communication Systems - Lecture',
 '25MT1307E-S': 'Mathematics For Communication Systems - Skilling',
 '25EC1302E': 'Analog Electronic Circuit Design',
 '25EC1302E-P': 'Analog Electronic Circuit Design - Practical',
 '25EC1302E-L': 'Analog Electronic Circuit Design - Lecture',
 '25EC1302E-S': 'Analog Electronic Circuit Design - Skilling',
 '25EC2103E': 'Cmos Vlsi Design',
 '25EC2103E-P': 'Cmos Vlsi Design - Practical',
 '25EC2103E-L': 'Cmos Vlsi Design - Lecture',
 '25EC2103E-S': 'Cmos Vlsi Design - Skilling',
 '25SC2008E': 'Full Stack Web Development',
 '25SC2008E-P': 'Full Stack Web Development - Practical',
 '25SC2008E-L': 'Full Stack Web Development - Lecture',
 '25SC2008E-S': 'Full Stack Web Development - Skilling',
 '25EC2104E': 'Signal Processing',
 '25EC2104E-P': 'Signal Processing - Practical',
 '25EC2104E-L': 'Signal Processing - Lecture',
 '25EC2104E-S': 'Signal Processing - Skilling',
 '25EC2205E': 'Modern Communication Systems',
 '25EC2205E-P': 'Modern Communication Systems - Practical',
 '25EC2205E-L': 'Modern Communication Systems - Lecture',
 '25EC2205E-S': 'Modern Communication Systems - Skilling',
 '25EC2307E': 'Fpga Design And Implementation',
 '25EC2307E-P': 'Fpga Design And Implementation - Practical',
 '25EC2307E-L': 'Fpga Design And Implementation - Lecture',
 '25EC2307E-S': 'Fpga Design And Implementation - Skilling',
 '25EC2309E': 'Iot Protocols And Cloud Integration',
 '25EC2309E-P': 'Iot Protocols And Cloud Integration - Practical',
 '25EC2309E-L': 'Iot Protocols And Cloud Integration - Lecture',
 '25EC2309E-S': 'Iot Protocols And Cloud Integration - Skilling',
 '25EC2310E': 'Wireless Communication Protocols',
 '25EC2310E-P': 'Wireless Communication Protocols - Practical',
 '25EC2310E-L': 'Wireless Communication Protocols - Lecture',
 '25EC2310E-S': 'Wireless Communication Protocols - Skilling',
 '25EC3315E': 'Testing And Verification Of Vlsi Circuits',
 '25EC3315E-P': 'Testing And Verification Of Vlsi Circuits - Practical',
 '25EC3315E-L': 'Testing And Verification Of Vlsi Circuits - Lecture',
 '25EC3315E-S': 'Testing And Verification Of Vlsi Circuits - Skilling',
 '25EC4118E': 'Edge Ai Systems - Npu Architecture, Deployment And Optmization',
 '25EC4118E-P': 'Edge Ai Systems - Npu Architecture, Deployment And Optmization - Practical',
 '25EC4118E-L': 'Edge Ai Systems - Npu Architecture, Deployment And Optmization - Lecture',
 '25EC4118E-S': 'Edge Ai Systems - Npu Architecture, Deployment And Optmization - Skilling',
};

export default function Dashboard() {
 const { user, loading: authLoading, logout, login } = useAuth();
 const { showLoader, hideLoader } = useLoading();
 const navigate = useNavigate();
 const location = useLocation();
 const initialDataFromNav = location.state?.initialDashboard || (() => {
 try {
 const stored = safeStorage.getItem('klu_initial_dashboard');
 return stored ? JSON.parse(stored) : null;
 } catch {
 return null;
 }
 })();

 const [academicYear, setAcademicYear] = useState<string>(() => {
 if (initialDataFromNav?.academicYear) return initialDataFromNav.academicYear;
 return user?.academicYears?.[0]?.value || '';
 });

 const [semesterId, setSemesterId] = useState<string>(() => {
 if (initialDataFromNav?.semesterId) return initialDataFromNav.semesterId;
 if (user?.semesters && user.semesters.length > 0) {
 const oddSem = user.semesters.find((sem: any) => sem.label.toLowerCase().includes('odd'));
 return oddSem ? oddSem.value : user.semesters[0].value;
 }
 return '';
 });

 const [data, setData] = useState<any>(initialDataFromNav || null);
 const [loading, setLoading] = useState<boolean>(!initialDataFromNav);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const initialLoadedRef = useRef<boolean>(!!initialDataFromNav);
 const fetchedAcademicInfo = useRef(false);

 useEffect(() => {
 if (!user) return;
 if (user.academicYears && user.academicYears.length > 0 && user.semesters && user.semesters.length > 0) {
 if (!academicYear) setAcademicYear(user.academicYears[0]?.value || '');
 if (!semesterId) {
 const oddSem = user.semesters.find((sem: any) => sem.label.toLowerCase().includes('odd'));
 setSemesterId(oddSem ? oddSem.value : (user.semesters[0]?.value || ''));
 }
 } else if (!fetchedAcademicInfo.current) {
 fetchedAcademicInfo.current = true;
 const fetchInfo = async () => {
 try {
 const infoRes = await fetch('/api/user/academic-info', {
 method: 'POST',
 headers: { 
 'Content-Type': 'application/json',
 'x-session-id': safeStorage.getItem('kl_session_id') || '',
 'x-csrf-token': safeStorage.getItem('kl_csrf_token') || ''
 }
 });
 const infoData = await infoRes.json();
 if (infoData.academicYears && infoData.semesters) {
 const updatedUser = { ...user, academicYears: infoData.academicYears, semesters: infoData.semesters };
 login(updatedUser); // Update global context
 if (!academicYear && infoData.academicYears[0]) setAcademicYear(infoData.academicYears[0].value);
 if (!semesterId && infoData.semesters[0]) {
 const odd = infoData.semesters.find((s: any) => s.label.toLowerCase().includes('odd'));
 setSemesterId(odd ? odd.value : infoData.semesters[0].value);
 }
 }
 } catch (e) {
 console.error('Failed to fetch academic info', e);
 }
 };
 fetchInfo();
 }
 }, [user, academicYear, semesterId, login]);

 // Immediately load cached dashboard when academicYear and semesterId change
 useEffect(() => {
 if (!academicYear || !semesterId) return;
 const dashCacheKey = `klu_dashboard_${academicYear}_${semesterId}`;
 const cached = safeStorage.getCachedJson(dashCacheKey) || (initialDataFromNav?.academicYear === academicYear && initialDataFromNav?.semesterId === semesterId ? initialDataFromNav : null);
 if (cached && (cached.summary || cached.subjects)) {
 setData(cached);
 setLoading(false);
 }
 }, [academicYear, semesterId]);

 const fetchDashboardData = async (forceRefresh = false) => {
 if (!user || !academicYear || !semesterId) {
 setLoading(false);
 return;
 }

 const dashCacheKey = `klu_dashboard_${academicYear}_${semesterId}`;

 setLoading(true);
 setIsRefreshing(true);
 showLoader("Loading Dashboard", "Fetching your profile and overview...");
 setError(null);

 try {
 const response = await fetch('/api/dashboard', {
 credentials: 'same-origin',
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-session-id': safeStorage.getItem('kl_session_id') || '',
 'x-csrf-token': safeStorage.getItem('kl_csrf_token') || ''
 },
 body: JSON.stringify({
 academicYear,
 semesterId,
 forceRefresh
 })
 });

 if (response.ok) {
 const result = await response.json();
 if (result && (result.summary || result.subjects)) {
 setData(result);
 safeStorage.setCachedJson(dashCacheKey, result);
 safeStorage.setItem('klu_last_sync_time', Date.now().toString());
 if (result.raw) {
 safeStorage.setCachedJson(`klu_attendance_${academicYear}_${semesterId}`, result.raw);
 }
 }
 } else {
 const errData = await response.json();
 if (response.status === 401 || response.status === 403) { setError('session_expired'); hideLoader(); return; }
 if (!data) {
 setError(errData.error || 'Failed to fetch data');
 }
 }
 } catch (err) {
 if (!data) {
 setError('A network error occurred.');
 }
 } finally {
 setLoading(false);
 setIsRefreshing(false);
 hideLoader();
 }
 };

 useEffect(() => {
 if (initialLoadedRef.current) {
 initialLoadedRef.current = false;
 return;
 }
 fetchDashboardData();
 }, [academicYear, semesterId]);

 if (authLoading) return null;
 if (!user) return null;

 const summary = data?.summary || { overallAttendance: 0, totalClasses: 0, attendedClasses: 0 };
 const subjects = data?.subjects || [];
 const overallPercentage = summary.overallAttendance.toFixed(1);

 // Fake trend data for visual appeal
 const trendData = [
 { name: 'Mon', attendance: Math.max(0, summary.overallAttendance - 5) },
 { name: 'Tue', attendance: Math.max(0, summary.overallAttendance - 2) },
 { name: 'Wed', attendance: summary.overallAttendance },
 { name: 'Thu', attendance: Math.min(100, summary.overallAttendance + 3) },
 { name: 'Fri', attendance: summary.overallAttendance },
 ];

 return (
 <>
 <SessionExpiredModal isOpen={error === 'session_expired'} />
 <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-8 md:pt-12">
 
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
 <div>
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-4xl md:text-5xl font-black text-[var(--text-primary)]"
 >
 Welcome back, <br/>
 <span className="marker-underline z-10 relative">{user?.name && user.name !== 'Student' ? user.name : (user?.id || 'Student')}</span>
 </motion.h1>

 <div className="flex flex-wrap items-center gap-3 mt-6">
 {user.academicYears && user.academicYears.length > 0 && (
 <select 
 value={academicYear} 
 onChange={(e) => setAcademicYear(e.target.value)}
 className="inline-flex items-center px-3 py-1.5 rounded-lg border-2 border-black dark:border-white/15 bg-white dark:bg-[#171A20] text-[var(--text-primary)] text-sm font-bold sticker-shadow-sm outline-none cursor-pointer hover:border-brand-blue"
 >
 {user.academicYears.map((yr: any) => (
 <option key={yr.value} value={yr.value} className="bg-white dark:bg-[#171A20] text-[var(--text-primary)]">{yr.label}</option>
 ))}
 </select>
 )}
 {user.semesters && user.semesters.length > 0 && (
 <select 
 value={semesterId} 
 onChange={(e) => setSemesterId(e.target.value)}
 className="inline-flex items-center px-3 py-1.5 rounded-lg border-2 border-black bg-brand-yellow text-black text-sm font-bold sticker-shadow-sm outline-none cursor-pointer"
 >
 {user.semesters.map((sem: any) => (
 <option key={sem.value} value={sem.value} className="bg-white text-black">{sem.label}</option>
 ))}
 </select>
 )}
 <button 
 onClick={() => fetchDashboardData(true)}
 disabled={loading || isRefreshing}
 className="inline-flex items-center justify-center p-2 rounded-lg border-2 border-black dark:border-white/15 bg-brand-pink text-black hover:bg-pink-400 disabled:opacity-50 transition-colors sticker-shadow-sm outline-none cursor-pointer"
 title="Sync / Refresh Data"
 >
 <RefreshCw size={18} className={loading || isRefreshing ? "animate-spin" : ""} />
 </button>
 <SyncStatus />
 </div>
 </div>

 <div className="flex flex-col items-stretch md:items-end gap-3">
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.2 }}
 className="flex items-center gap-4 bg-white dark:bg-[#1B1F26] p-4 border-2 border-black dark:border-white/10 rounded-2xl sticker-shadow-sm text-[var(--text-primary)]"
 >
 <div className="w-16 h-16 rounded-full border-4 border-brand-pink flex items-center justify-center font-black text-xl text-brand-pink relative overflow-hidden bg-brand-pink/10">
 <span className="relative z-10">{Math.round(Number(overallPercentage))}%</span>
 <div className="absolute bottom-0 left-0 right-0 bg-brand-pink/30" style={{ height: `${overallPercentage}%` }}></div>
 </div>
 <div>
 <p className="text-sm text-[var(--text-secondary)] font-bold uppercase tracking-wider">Overall</p>
 <p className="font-black text-lg text-[var(--text-primary)]">Attendance</p>
 </div>
 </motion.div>
 <button 
 
 className="inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 border-black bg-[#98f5e1] hover:bg-[#7ce0ca] text-black text-sm font-black uppercase tracking-wide sticker-shadow-sm outline-none cursor-pointer transition-all w-full"
 >
 <Table size={18} className="mr-2" />
 ERP Attendance List
 </button>
 </div>
 </div>

 <AnimatePresence>
 {error && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="mb-6 overflow-hidden"
 >
 <div className="p-4 bg-brand-red text-white border-2 border-black rounded-xl font-bold flex items-center gap-2 sticker-shadow-sm animate-shake">
 <AlertCircle size={20} className="shrink-0" />
 <span className="text-sm">{error}</span>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="flex flex-col gap-8">
 
 {/* Left Column */}
 <div className="space-y-8">
 
 
          {/* Top Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Total Classes</span>
              <span className="font-black text-3xl">{summary.totalClasses}</span>
            </div>
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Total Attended</span>
              <span className="font-black text-3xl">{summary.attendedClasses}</span>
            </div>
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Overall %</span>
              <span className="font-black text-3xl text-brand-blue">{overallPercentage}%</span>
            </div>
          </div>

          {/* Trend Chart */}
 <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 md:p-8 sticker-shadow-sm paper-edge relative text-[var(--text-primary)]">
 {/* Decorative Tape */}
 <div className="absolute top-4 -right-4 w-16 h-6 bg-brand-green/80 backdrop-blur-sm rotate-12 z-20"></div>

 <div className="flex items-center justify-between mb-8">
 <h2 className="text-2xl font-black text-[var(--text-primary)]">Weekly Trend</h2>
 <button className="p-2 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors">
 <MoreHorizontal size={20} />
 </button>
 </div>

 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
 <defs>
 <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.4}/>
 <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#858C98', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }} />
 <Tooltip 
 contentStyle={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px', border: '2px solid var(--border-color)', boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)', fontWeight: 'bold' }} 
 />
 <Area type="monotone" dataKey="attendance" stroke="#00B4D8" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 
 {/* Subjects Grid */}
 <div>
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-black text-[var(--text-primary)]">Your Subjects</h2>
 {loading && <Loader2 className="animate-spin text-brand-blue" />}
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">

 {loading && (
 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
 <Loader2 className="animate-spin text-brand-blue w-8 h-8" />
 </div>
 )}
 {subjects.map((subject: any, idx: number) => {
 const colors = ['bg-brand-orange', 'bg-brand-red', 'bg-brand-green', 'bg-brand-purple', 'bg-brand-blue'];
 return (
 <SubjectCard 
 key={subject.code + idx}
 name={subject.name && !subject.name.startsWith('Unknown Subject') ? subject.name : (COURSE_MAP[subject.code] || subject.name)} 
 code={subject.code} 
 faculty={subject.faculty}
 timetable={subject.timetable}
 attendance={subject.attendancePercentage} 
 total={subject.totalClasses} 
 attended={subject.attendedClasses} 
 color={colors[idx % colors.length]} 
 alert={subject.attendancePercentage < 75}
 components={subject.components}
 />
 );
 })}

 
          
{subjects.length === 0 && !loading && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl text-center text-[var(--text-muted)] font-bold bg-white dark:bg-[#1B1F26]">
                No attendance data found for this semester.
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <div className="pt-8">
            <button 
              onClick={async () => {
                await logout();
                navigate('/login', { state: { message: 'Session expired. Please login again.' } });
              }}
              className="w-full sm:w-auto mx-auto px-8 py-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-3 border-2 border-red-300 dark:border-red-800/60 sticker-shadow-sm hover:sticker-shadow-hover"
            >
              <LogOut size={20} />
              Logout from Portal
            </button>
          </div>
        </div>
      </div>

 
          
</div>
 </div>
 </>
 );
}

function SubjectCard({ name, code, faculty, timetable, attendance, total, attended, color, alert, components }: { key?: React.Key; name: string, code: string, faculty?: string, timetable?: string, attendance: number, total: number, attended: number, color: string, alert?: boolean, components?: Record<string, { total: number, attended: number }> }) {
 const types = components ? Object.keys(components).filter(k => components[k].total > 0 || (k === 'L' || k === 'T' || k === 'P' || k === 'S')) : [];
 
 const [simulators, setSimulators] = React.useState([
 { action: 'attend', count: 0, type: types.length > 0 ? types[0] : 'L' },
 { action: 'attend', count: 0, type: types.length > 1 ? types[1] : (types.length > 0 ? types[0] : 'L') },
 { action: 'attend', count: 0, type: types.length > 2 ? types[2] : (types.length > 0 ? types[0] : 'L') }
 ]);

 React.useEffect(() => {
 if (types.length > 0) {
 setSimulators(prev => prev.map(s => types.includes(s.type) ? s : { ...s, type: types[0] }));
 }
 }, [types.join(',')]);

 // Calculate simulated values
 let simComponents = components ? JSON.parse(JSON.stringify(components)) : null;
 let simTotal = total;
 let simAttended = attended;

 simulators.forEach(sim => {
 let numCount = typeof sim.count === 'number' ? sim.count : (parseInt(sim.count as string) || 0);
 if (numCount > 50) numCount = 50;
 if (numCount < 0) numCount = 0;

 if (simComponents) {
 if (simComponents[sim.type]) {
 simComponents[sim.type].total += numCount;
 if (sim.action === 'attend') {
 simComponents[sim.type].attended += numCount;
 }
 }
 } else {
 simTotal += numCount;
 if (sim.action === 'attend') {
 simAttended += numCount;
 }
 }
 });

 let wSum = 0;
 let weightedSum = 0;

 if (simComponents) {
 Object.keys(simComponents).forEach(k => {
 const t = simComponents[k].total;
 const a = simComponents[k].attended;
 const w = LTPS_WEIGHTS[k];
 if (t > 0 && w) {
 wSum += w;
 weightedSum += (a / t * 100) * w;
 }
 });
 simTotal = Object.values(simComponents).reduce<number>((acc, val: any) => acc + (val.total || 0), 0);
 simAttended = Object.values(simComponents).reduce<number>((acc, val: any) => acc + (val.attended || 0), 0);
 }

 let finalPercentage = attendance;
 if (simComponents) {
 finalPercentage = calculateLTPS(simComponents).percentage;
 } else if (simTotal > 0) {
 finalPercentage = Math.round((simAttended / simTotal) * 100);
 }
 
 const roundedAtt = Math.round(finalPercentage);
 const isAlert = roundedAtt < 75;

 let projectionsHtml = null;

 if (simComponents) {
 const formatProjections = (target: number) => {
 const { status, projections, combinedProjection } = calculateLTPSProjections(simComponents, target);
 const safeToSkip = projections.filter((p: any) => p.action === 'skip');
 const needToAttend = projections.filter((p: any) => p.action === 'attend');

 let message = "";
 if (status === 'safe') {
 if (safeToSkip.length > 0) {
 const parts = safeToSkip.map((p: any) => `${p.classes === '>10' ? '10+' : p.classes} ${p.type === 'L' ? 'Lecture' : p.type === 'T' ? 'Tutorial' : p.type === 'P' ? 'Practical' : 'Skilling'}${p.classes !== 1 && p.classes !== '>10' ? 's' : ''}`);
 message = `Individually: You can bunk ${parts.join(' or ')}.`;
 } else {
 message = `Not possible to bunk any individual class.`;
 }
 } else {
 if (needToAttend.length > 0) {
 const parts = needToAttend.map((p: any) => `${p.classes === '>10' ? '10+' : p.classes} ${p.type === 'L' ? 'Lecture' : p.type === 'T' ? 'Tutorial' : p.type === 'P' ? 'Practical' : 'Skilling'}${p.classes !== 1 && p.classes !== '>10' ? 's' : ''}`);
 message = `Individually: You need to attend ${parts.join(' or ')} to reach ${target}%.`;
 } else {
 message = `Not possible to reach ${target}% soon individually.`;
 }
 }

 let realisticMessage = null;
 if (combinedProjection && combinedProjection.counts) {
 const parts = Object.entries(combinedProjection.counts).filter(([_, count]: [string, any]) => count > 0).map(([type, count]: [string, any]) => {
 return `${count} ${type === 'L' ? 'Lecture' : type === 'T' ? 'Tutorial' : type === 'P' ? 'Practical' : 'Skilling'}${count !== 1 ? 's' : ''}`;
 });
 if (parts.length > 0) {
 if (combinedProjection.action === 'attend') {
 realisticMessage = `Realistically: You need to attend ${parts.join(' AND ')} to reach ${target}%.`;
 } else {
 realisticMessage = `Realistically: You can bunk ${parts.join(' AND ')} and stay above ${target}%.`;
 }
 }
 }

 return { status, message, realisticMessage };
 };

 const proj75 = formatProjections(75);
 const proj85 = formatProjections(85);

 projectionsHtml = (
 <div className="mt-2 pt-3 border-t border-black/20 flex flex-col gap-3">
 <div className="flex flex-col gap-1.5">
 <div className="flex justify-between items-end">
 <span className="text-[10px] font-black uppercase tracking-wider text-black/70">Simulated Attendance</span>
 <span className={`text-sm font-black ${isAlert ? 'text-red-700' : 'text-emerald-800'}`}>{roundedAtt}%</span>
 </div>
 <div className="w-full bg-white/70 rounded-full h-3 border-2 border-black overflow-hidden relative">
 <div 
 className={`h-full ${isAlert ? 'bg-[#ff9e9e]' : 'bg-[#98f5e1]'} transition-all duration-300 border-r-2 border-black`}
 style={{ width: `${Math.min(roundedAtt, 100)}%` }}
 ></div>
 <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30 z-10" style={{ left: '75%' }}></div>
 <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30 z-10" style={{ left: '85%' }}></div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-2">
 <div className="bg-[#98f5e1]/30 p-2 rounded-lg border border-black/20">
 <h4 className="text-[10px] font-black uppercase tracking-wider mb-1 text-black/70">75% Target</h4>
 <p className={`text-xs font-bold ${proj75.status === 'safe' ? 'text-emerald-900' : 'text-red-800'} leading-snug mb-1`}>{proj75.message}</p>
 {proj75.realisticMessage && (
 <p className="text-[11px] font-bold text-gray-700 leading-snug">{proj75.realisticMessage}</p>
 )}
 </div>

 <div className="bg-[#f59898]/20 p-2 rounded-lg border border-black/20">
 <h4 className="text-[10px] font-black uppercase tracking-wider mb-1 text-black/70">85% Target</h4>
 <p className={`text-xs font-bold ${proj85.status === 'safe' ? 'text-emerald-900' : 'text-red-800'} leading-snug mb-1`}>{proj85.message}</p>
 {proj85.realisticMessage && (
 <p className="text-[11px] font-bold text-gray-700 leading-snug">{proj85.realisticMessage}</p>
 )}
 </div>
 </div>
 </div>
 );
 } else if (simTotal > 0) {
 const calc = (t: number) => calculateAttendanceStatus(simAttended, simTotal, t);
 const p75 = calc(75);
 const p85 = calc(85);

 projectionsHtml = (
 <div className="mt-2 pt-3 border-t border-black/20 flex flex-col gap-3">
 <div className="flex flex-col gap-1.5">
 <div className="flex justify-between items-end">
 <span className="text-[10px] font-black uppercase tracking-wider text-black/70">Simulated Attendance</span>
 <span className={`text-sm font-black ${isAlert ? 'text-red-700' : 'text-emerald-800'}`}>{roundedAtt}%</span>
 </div>
 <div className="w-full bg-white/70 rounded-full h-3 border-2 border-black overflow-hidden relative">
 <div 
 className={`h-full ${isAlert ? 'bg-[#ff9e9e]' : 'bg-[#98f5e1]'} transition-all duration-300 border-r-2 border-black`}
 style={{ width: `${Math.min(roundedAtt, 100)}%` }}
 ></div>
 <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30 z-10" style={{ left: '75%' }}></div>
 <div className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30 z-10" style={{ left: '85%' }}></div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-2">
 <div className="bg-[#98f5e1]/30 p-2 rounded-lg border border-black/20">
 <h4 className="text-[10px] font-black uppercase tracking-wider mb-1 text-black/70">75% Target</h4>
 <p className={`text-xs font-bold ${p75.status === 'safe' ? 'text-emerald-900' : 'text-red-800'} leading-snug`}>
 {p75.status === 'safe' 
 ? `You can bunk ${p75.classes} classes.` 
 : `You need to attend ${p75.classes} classes.`}
 </p>
 </div>

 <div className="bg-[#f59898]/20 p-2 rounded-lg border border-black/20">
 <h4 className="text-[10px] font-black uppercase tracking-wider mb-1 text-black/70">85% Target</h4>
 <p className={`text-xs font-bold ${p85.status === 'safe' ? 'text-emerald-900' : 'text-red-800'} leading-snug`}>
 {p85.status === 'safe' 
 ? `You can bunk ${p85.classes} classes.` 
 : `You need to attend ${p85.classes} classes.`}
 </p>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-2xl p-5 sticker-shadow-sm hover:sticker-shadow-hover hover:border-brand-blue transition-all flex flex-col h-full text-[var(--text-primary)]">
 <div className="flex justify-between items-start mb-4">
 <div className={`px-3 py-1 rounded-lg border-2 border-black text-xs font-bold ${color} text-black`}>
 {code}
 </div>
 {isAlert ? (
 <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xs bg-red-100 dark:bg-red-950/50 px-2.5 py-1 rounded-md border border-red-300 dark:border-red-800/60">
 <AlertCircle size={14} /> Shortage
 </div>
 ) : (
 <div className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800/60">
 <CheckCircle2 size={14} /> Safe
 </div>
 )}
 </div>

 <h3 className="font-black text-lg mb-2 leading-tight line-clamp-2 text-[var(--text-primary)]" title={name}>{name}</h3>
 
 {faculty && (
 <p className="text-xs text-[var(--text-secondary)] font-bold tracking-wide mb-1 flex items-start gap-1">
 <span>■■■</span> 
 <span className="line-clamp-2">{faculty !== 'Unknown Faculty' ? faculty : 'Faculty not listed'}</span>
 </p>
 )}
 {timetable && (
 <p className="text-xs text-brand-blue font-bold tracking-wide mb-3 flex items-start gap-1">
 <span>■</span> 
 <span className="line-clamp-2">{timetable !== 'TBA' ? timetable : 'Timetable not listed'}</span>
 </p>
 )}

 <p className="text-[var(--text-secondary)] font-medium text-sm mt-auto mb-4">{simAttended} / {simTotal} Classes Attended</p>

 <div className="w-full bg-[var(--bg-hover)] rounded-full h-3 border border-[var(--border-subtle)] overflow-hidden mb-2">
 <div 
 className={`h-full ${isAlert ? 'bg-brand-red' : 'bg-brand-green'} transition-all duration-1000`}
 style={{ width: `${Math.min(roundedAtt, 100)}%` }}
 ></div>
 </div>
 <div className="flex justify-between items-center font-bold">
 <span className={isAlert ? 'text-brand-red' : 'text-brand-green'}>{roundedAtt}%</span>
 <span className="text-[var(--text-muted)] text-xs">Target: {roundedAtt >= 75 ? "85%" : "75%"}</span>
 </div>

 {simComponents && (
 <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2">
 <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Components</p>
 {Object.entries(simComponents).map(([k, v]: [string, any]) => (
 <div key={k} className="flex justify-between text-xs">
 <span className="text-[var(--text-secondary)]">{k === 'L' ? 'Lecture' : k === 'T' ? 'Tutorial' : k === 'P' ? 'Practical' : 'Skilling'} (Weightage: {LTPS_WEIGHTS[k] * 100}%)</span>
 <span className="font-bold text-[var(--text-primary)]">{v.attended}/{v.total} ({v.total > 0 ? Math.round(v.attended/v.total*100) : 0}%)</span>
 </div>
 ))}
 </div>
 )}

 {/* Simulator UI */}
 <div className="mt-4 bg-[#FFE874] p-3.5 rounded-2xl border-2 border-black sticker-shadow-sm text-xs flex flex-col gap-3 relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 text-5xl opacity-20 transform rotate-12 group-hover:scale-110 transition-transform duration-300">■</div>
 
 <div className="flex items-center gap-1 font-black text-[13px] uppercase tracking-wide border-b-2 border-black/10 pb-2 mb-1 text-black">
 <span className="text-xl">■■</span> What If...
 </div>
 <div className="flex flex-col gap-2 relative z-10">
 {simulators.map((sim, idx) => (
 <div key={idx} className="flex flex-wrap items-center gap-2 font-bold text-black">
 <span className={`text-sm w-8 font-black ${idx > 0 ? 'text-gray-700 text-xs' : 'text-black'}`}>{idx === 0 ? 'I' : 'PLUS'}</span>
 <select value={sim.action} onChange={e => {
 setSimulators(prev => { const n = [...prev]; n[idx] = { ...n[idx], action: e.target.value as any }; return n; });
 }} className={`font-black text-sm rounded-lg px-2 py-1 outline-none cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-black ${sim.action === 'attend' ? 'bg-[#98f5e1]' : 'bg-[#ff9e9e]'}`}>
 <option value="attend">ATTEND</option>
 <option value="bunk">BUNK</option>
 </select>
 <input type="number" min="0" max="50" value={sim.count} onChange={e => {
 let val = parseInt(e.target.value);
 if (val > 50) val = 50;
 if (val < 0) val = 0;
 setSimulators(prev => { const n = [...prev]; n[idx] = { ...n[idx], count: isNaN(val) ? '' : val as any }; return n; });
 }} className="w-12 bg-white border-2 border-black rounded-lg px-1 py-1 text-center font-black text-sm outline-none text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" />
 {types.length > 0 ? (
 <select value={sim.type} onChange={e => {
 setSimulators(prev => { const n = [...prev]; n[idx] = { ...n[idx], type: e.target.value }; return n; });
 }} className="bg-white border-2 border-black rounded-lg px-2 py-1 font-black text-sm outline-none cursor-pointer text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
 {types.map(t => <option key={t} value={t}>{t === 'L' ? 'Lectures' : t === 'T' ? 'Tutorials' : t === 'P' ? 'Practicals' : 'Skilling'}</option>)}
 </select>
 ) : (
 <span className="text-sm text-black">Classes</span>
 )}
 </div>
 ))}
 </div>
 {projectionsHtml}
 </div>
 </div>
 );
}
