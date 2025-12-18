import React, { useState } from 'react';
import { Icons } from '../ui/Icons';
import { generateNoteContent } from '../../services/geminiService';

export const WorkApp: React.FC = () => {
  const [notes, setNotes] = useState<{id: number, title: string, content: string}[]>([
    { id: 1, title: 'Project Alpha', content: 'Remember to double check the Q3 render pipeline.' },
    { id: 2, title: 'Grocery List', content: 'Bananas, Milk, Yellow Paint.' }
  ]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const createSmartNote = async () => {
    setIsGenerating(true);
    const newId = Date.now();
    const content = await generateNoteContent("A productive day at Yellow OS Inc.");
    const newNote = {
        id: newId,
        title: `Smart Note ${notes.length + 1}`,
        content: content
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newId);
    setIsGenerating(false);
  };

  const currentNote = notes.find(n => n.id === activeNote);

  return (
    <div className="flex h-full bg-yellow-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-100 border-r border-yellow-200 flex flex-col">
        <div className="p-4 border-b border-yellow-200 bg-yellow-200/50">
          <h2 className="font-bold text-lg text-yellow-800 flex items-center gap-2">
            <Icons.Notes size={20} /> Work Notes
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`w-full text-left p-4 border-b border-yellow-200 transition-colors ${activeNote === note.id ? 'bg-white font-medium shadow-sm' : 'hover:bg-yellow-200/30'}`}
            >
              <div className="truncate text-gray-900">{note.title}</div>
              <div className="truncate text-xs text-gray-500 mt-1">{note.content.substring(0, 25)}...</div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-yellow-200">
            <button 
                onClick={createSmartNote}
                disabled={isGenerating}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {isGenerating ? <Icons.Refresh className="animate-spin" size={16}/> : '+ Smart Note'}
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        {currentNote ? (
          <div className="max-w-2xl mx-auto">
            <input 
                value={currentNote.title}
                onChange={(e) => setNotes(notes.map(n => n.id === currentNote.id ? {...n, title: e.target.value} : n))}
                className="text-3xl font-bold mb-6 text-gray-800 w-full border-none focus:outline-none focus:ring-0 placeholder-gray-300"
                placeholder="Title"
            />
            <textarea 
                value={currentNote.content}
                onChange={(e) => setNotes(notes.map(n => n.id === currentNote.id ? {...n, content: e.target.value} : n))}
                className="w-full h-[60vh] resize-none border-none focus:outline-none focus:ring-0 text-lg leading-relaxed text-gray-600 placeholder-gray-300"
                placeholder="Start typing..."
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-yellow-300/50">
            <Icons.Notes size={96} />
            <p className="mt-4 text-yellow-800/40 text-lg">Select or create a note to get to work.</p>
          </div>
        )}
      </div>
    </div>
  );
};