import React, { useState } from 'react';
import { reportBug, predictAI } from '../services/api';
const ReportBug: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');
  const [message, setMessage] = useState('');
  const [showAnim, setShowAnim] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage('Title and description are required.');
      return;
    }
    try {
      const bug = { id: Date.now().toString(), title, description, status };
      await reportBug(bug);
      
      // Try to get AI prediction, but don't fail the whole operation if it fails
      let aiErrorOccurred = false;
      try {
        const ai = await predictAI({ title, description });
        setAiResult(ai);
      } catch (aiError: any) {
        console.error('AI prediction failed:', aiError);
        aiErrorOccurred = true;
        // Set AI error message but continue to show success for bug report
        setMessage('Bug reported successfully! (AI prediction unavailable: ' + (aiError.message || 'Unknown error') + ')');
      }
      
      // Only set success message if AI didn't fail, or if it did fail, message is already set above
      if (!aiErrorOccurred) {
        setMessage('Bug reported successfully!');
      }
      
      setShowAnim(true);
      setTimeout(() => setShowAnim(false), 2000);
      setTitle('');
      setDescription('');
      setStatus('open');
    } catch (error: any) {
      console.error('Error reporting bug:', error);
      setMessage('Failed to report bug: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Report New Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea className="border p-2 w-full" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
  {showAnim && <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">✅</div>}
      {aiResult && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded">
          <h3 className="font-bold mb-2">AI Prediction</h3>
          <pre>{JSON.stringify(aiResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
export default ReportBug;
