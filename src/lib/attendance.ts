export function calculateAttendanceStatus(attended: number, total: number, targetPercentage: number = 75) {
 if (total === 0) return { percentage: 0, status: 'N/A', classes: 0, target: targetPercentage };
 
 const percentage = (attended / total) * 100;
 const targetFraction = targetPercentage / 100;

 if (percentage < targetPercentage) {
 let needed = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
 if (needed < 0) needed = 0;
 return { percentage, status: 'shortage', classes: needed, target: targetPercentage };
 } else {
 let bunk = Math.floor((attended / targetFraction) - total);
 if (bunk < 0) bunk = 0;
 return { percentage, status: 'safe', classes: bunk, target: targetPercentage };
 }
}

export const LTPS_WEIGHTS: Record<string, number> = {
 L: 1,
 T: 0.25,
 P: 0.5,
 S: 0.25
};

export function calculateLTPS(components: Record<string, { total: number, attended: number }>) {
 let wSum = 0;
 let weightedSum = 0;
 
 Object.keys(components).forEach(k => {
 const total = components[k].total;
 const attended = components[k].attended;
 if (total > 0 && LTPS_WEIGHTS[k]) {
 const w = LTPS_WEIGHTS[k];
 wSum += w;
 weightedSum += (attended / total * 100) * w;
 }
 });

 if (wSum === 0) return { percentage: 0, wSum: 0, weightedSum: 0 };
 
 return {
 percentage: Math.ceil(weightedSum / wSum),
 wSum,
 weightedSum
 };
}

export function calculateLTPSProjections(components: Record<string, { total: number, attended: number }>, targetPercentage: number) {
 const current = calculateLTPS(components);
 if (current.wSum === 0) return { status: 'N/A', projections: [], combinedProjection: null };
 
 const targetSum = targetPercentage * current.wSum;
 const projections: any[] = [];
 
 Object.keys(components).forEach(k => {
 const total = components[k].total;
 const attended = components[k].attended;
 const w = LTPS_WEIGHTS[k];
 
 if (total > 0 && w) {
 const otherSum = current.weightedSum - ((attended / total * 100) * w);
 const R = targetSum - otherSum;
 
 if (current.percentage >= targetPercentage) {
 // Safe to skip
 if (R <= 0) {
 projections.push({ type: k, action: 'skip', classes: '>10', newAttended: attended, newTotal: total + 10 });
 } else {
 let x = Math.floor((attended * 100 * w / R) - total);
 if (x > 10) {
 projections.push({ type: k, action: 'skip', classes: '>10', newAttended: attended, newTotal: total + 10 });
 } else if (x > 0) {
 projections.push({ type: k, action: 'skip', classes: x, newAttended: attended, newTotal: total + x });
 }
 }
 } else {
 // Need to attend
 const coeff = 100 * w - R;
 if (coeff <= 0) {
 projections.push({ type: k, action: 'attend', classes: '>10', newAttended: attended + 10, newTotal: total + 10 });
 } else {
 let x = Math.ceil((R * total - 100 * w * attended) / coeff);
 if (x > 10) {
 projections.push({ type: k, action: 'attend', classes: '>10', newAttended: attended + 10, newTotal: total + 10 });
 } else if (x > 0) {
 projections.push({ type: k, action: 'attend', classes: x, newAttended: attended + x, newTotal: total + x });
 }
 }
 }
 }
 });

 // Calculate Combined Projection (Realistic)
 let combinedProjection = null;
 const active = Object.keys(components).filter(k => components[k].total > 0 && LTPS_WEIGHTS[k]);
 if (active.length > 1) {
 const minTotal = Math.min(...active.map(k => components[k].total));
 const steps: Record<string, number> = {};
 const sequence: string[] = [];
 active.forEach(k => {
 steps[k] = Math.max(1, Math.round(components[k].total / minTotal));
 for (let i = 0; i < steps[k]; i++) sequence.push(k);
 });
 // Sort sequence by highest weight to reach target efficiently
 sequence.sort((a, b) => LTPS_WEIGHTS[b] - LTPS_WEIGHTS[a]);
 
 let sim = JSON.parse(JSON.stringify(components));
 const added: Record<string, number> = {};
 active.forEach(k => added[k] = 0);
 
 let iters = 0;
 if (current.percentage < targetPercentage) {
 while (calculateLTPS(sim).percentage < targetPercentage && iters < 200) {
 const k = sequence[iters % sequence.length];
 sim[k].total++;
 sim[k].attended++;
 added[k]++;
 iters++;
 }
 if (calculateLTPS(sim).percentage >= targetPercentage) {
 combinedProjection = { action: 'attend', counts: added };
 }
 } else {
 let simBunk = JSON.parse(JSON.stringify(components));
 const bunked: Record<string, number> = {};
 active.forEach(k => bunked[k] = 0);
 while (calculateLTPS(simBunk).percentage >= targetPercentage && iters < 200) {
 const k = sequence[iters % sequence.length];
 let testSim = JSON.parse(JSON.stringify(simBunk));
 testSim[k].total++;
 if (calculateLTPS(testSim).percentage >= targetPercentage) {
 simBunk = testSim;
 bunked[k]++;
 iters++;
 } else {
 break;
 }
 }
 if (iters > 0) {
 combinedProjection = { action: 'skip', counts: bunked };
 }
 }
 }
 
 return {
 status: current.percentage >= targetPercentage ? 'safe' : 'shortage',
 projections,
 combinedProjection
 };
}
