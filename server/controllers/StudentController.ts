// Should throw if not set, but keep fallback for safety if missing?import type { Request, Response } from 'express';
import { StudentService } from '../services/StudentService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class StudentController {
 constructor(private studentService: StudentService) {}

 login = async (req: import('express').Request, res: import('express').Response) => {
 try {
 const { studentId, password, rememberMe } = req.body;
 
 if (!studentId || !password) {
 return res.status(400).json({ error: "Student ID and password are required" });
 }

 const result = await this.studentService.login(studentId, password, rememberMe);

 if (result.success && result.user && result.token) {
 res.cookie("token", result.token, {
 httpOnly: true,
 secure: process.env.NODE_ENV === "production",
 sameSite: "strict",
 maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
 });
 res.json({ success: true, user: result.user });
 } else {
 res.status(401).json({ error: result.error });
 }
 } catch (error) {
 console.error("Login Error:", error);
 res.status(500).json({ error: "Internal server error during login" });
 }
 };

 logout = (req: import('express').Request, res: import('express').Response) => {
 res.clearCookie("token");
 res.json({ success: true });
 };

 me = (req: import('express').Request, res: import('express').Response) => {
 const token = req.cookies.token;
 if (!token) return res.status(401).json({ error: "Not authenticated" });

 try {
 const decoded = jwt.verify(token, JWT_SECRET as string);
 res.json({ user: decoded });
 } catch (err) {
 res.clearCookie("token");
 res.status(401).json({ error: "Invalid token" });
 }
 };

 getDashboard = async (req: import('express').Request, res: import('express').Response) => {
 const token = req.cookies.token;
 if (!token) return res.status(401).json({ error: "Not authenticated" });

 try {
 const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string, name: string };
 const data = await this.studentService.getDashboardData(decoded.id);
 res.json(data);
 } catch (err) {
 res.status(500).json({ error: "Failed to fetch dashboard data" });
 }
 };
}
