import React, { useEffect, useState } from 'react';
import { safeStorage } from '../utils/storage';
import { RefreshCcw } from 'lucide-react';

export default function SyncStatus() {
 const [timeText, setTimeText] = useState('');

 useEffect(() => {
 const updateText = () => {
 const syncTimeStr = safeStorage.getItem('klu_last_sync_time');
 if (!syncTimeStr) {
 setTimeText('');
 return;
 }
 
 const syncTime = parseInt(syncTimeStr, 10);
 if (isNaN(syncTime)) {
 setTimeText('');
 return;
 }

 const diffMs = Date.now() - syncTime;
 const diffSecs = Math.floor(diffMs / 1000);
 const diffMins = Math.floor(diffSecs / 60);
 const diffHours = Math.floor(diffMins / 60);

 if (diffSecs < 60) {
 setTimeText('Synced just now');
 } else if (diffMins < 60) {
 setTimeText(`Synced ${diffMins} min${diffMins > 1 ? 's' : ''} ago`);
 } else {
 setTimeText(`Synced ${diffHours} hr${diffHours > 1 ? 's' : ''} ago`);
 }
 };

 updateText();
 // Update every 2 seconds
 const interval = setInterval(updateText, 2000);
 return () => clearInterval(interval);
 }, []);

 if (!timeText) return null;

 return (
 <div className="inline-flex shrink-0 items-center gap-2 px-3 py-1.5 bg-brand-yellow text-black rounded-lg border-2 border-black sticker-shadow-sm transform -rotate-2 hover:rotate-0 transition-all font-display">
 <RefreshCcw size={14} className="text-black shrink-0 stroke-[3]" />
 <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{timeText}</span>
 </div>
 );
}
