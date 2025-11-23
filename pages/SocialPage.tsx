import React, { useState } from 'react';
import { MOCK_POSTS, MOCK_TRAINERS } from '../constants';
import { MessageCircle, Heart, Share2, MapPin, Search, Filter } from 'lucide-react';
import { UserRole } from '../types';

const SocialPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'trainers'>('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const filteredTrainers = MOCK_TRAINERS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter ? t.location.toLowerCase().includes(regionFilter.toLowerCase()) : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8 bg-zinc-900/50 p-2 rounded-xl inline-flex shadow-sm border border-zinc-800/50">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
        >
          Community Feed
        </button>
        <button 
          onClick={() => setActiveTab('trainers')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'trainers' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
        >
          Find a Personal
        </button>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-6 max-w-2xl">
           {/* Mock Post Creator */}
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex gap-4 shadow-sm">
              <img src="https://picsum.photos/seed/user1/50/50" className="w-10 h-10 rounded-full ring-2 ring-zinc-800" alt="Me" />
              <div className="flex-1">
                 <input type="text" placeholder="Share your PR or meal..." className="w-full bg-transparent border-none text-white focus:ring-0 placeholder-zinc-500 mb-2 focus:outline-none" />
                 <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <button className="text-zinc-500 hover:text-emerald-500 text-xs font-medium">Add Photo / Video</button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Post</button>
                 </div>
              </div>
           </div>

           {MOCK_POSTS.map(post => (
             <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-700 transition-colors">
                <div className="p-4 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center font-bold text-white ring-2 ring-zinc-900">
                      {post.author[0]}
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <span className="font-semibold text-white">{post.author}</span>
                         {post.role === UserRole.TRAINER && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">Coach</span>}
                      </div>
                      <span className="text-xs text-zinc-500">{post.timestamp}</span>
                   </div>
                   <button className="ml-auto text-zinc-600 hover:text-zinc-400">•••</button>
                </div>
                {post.image && (
                    <img src={post.image} alt="Post content" className="w-full h-80 object-cover" />
                )}
                <div className="p-4">
                    <p className="text-zinc-200 text-sm mb-4 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6 text-zinc-500 border-t border-zinc-800/50 pt-4">
                        <button className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors"><Heart size={18} /> {post.likes}</button>
                        <button className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors"><MessageCircle size={18} /> {post.comments}</button>
                        <button className="flex items-center gap-2 text-sm hover:text-white transition-colors ml-auto"><Share2 size={18} /></button>
                    </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search trainers by name..." 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="relative md:w-1/3">
                  <MapPin className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="City or Region" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 focus:outline-none"
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                  />
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTrainers.length > 0 ? filteredTrainers.map(trainer => (
                <div key={trainer.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-start gap-4 hover:border-zinc-700 transition-colors group">
                   <div className="w-16 h-16 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-500 text-2xl font-bold border border-zinc-700">
                     {trainer.name[0]}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                {trainer.name}
                                {trainer.isOnline && <span className="w-2 h-2 rounded-full bg-green-500 border border-black" title="Online now"></span>}
                            </h3>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1">{trainer.specialty}</p>
                         </div>
                         <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 text-xs font-bold border border-yellow-500/20">
                            ★ {trainer.rating}
                         </div>
                      </div>
                      
                      <div className="flex items-center text-zinc-500 text-xs gap-1 mb-4">
                         <MapPin size={12} /> {trainer.location}
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">Hire Coach</button>
                         <button className="px-3 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                            <MessageCircle size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              )) : (
                 <div className="col-span-2 text-center py-12 text-zinc-500">
                    No trainers found matching your criteria.
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;