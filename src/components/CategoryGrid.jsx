import { motion } from 'framer-motion';
import { Stethoscope, Heart, Baby, Grid, Eye, Search, Plus, Ear, FlaskConical } from 'lucide-react';

const CategoryGrid = ({ onSelect, selectedId }) => {
    const categories = [
        { id: 'general', name: 'General', icon: <Stethoscope size={20} />, color: 'from-blue-400 to-blue-600' },
        { id: 'heart', name: 'Heart', icon: <Heart size={20} />, color: 'from-rose-400 to-rose-600' },
        { id: 'child', name: 'Child', icon: <Baby size={20} /> },
        { id: 'eyes', name: 'Eyes', icon: <Ear size={20} />, color: 'from-amber-400 to-amber-600' },
        { id: 'more', name: 'More', icon: <Grid size={20} />, color: 'from-slate-400 to-slate-600' },
    ];

    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                Doctor Categories
            </h3>
            <div className="flex overflow-x-auto no-scrollbar py-2 px-4 -mx-4">
                <div className="flex items-end gap-1.5 p-2 px-3 glass rounded-[24px] shadow-xl border border-white/40 mx-auto min-w-max">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex flex-col items-center gap-1.5 relative group shrink-0">
                            <motion.button
                                onClick={() => onSelect && onSelect(cat.id)}
                                whileHover={{ scale: 1.1, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-14 h-14 rounded-[20px] flex items-center justify-center relative overflow-hidden transition-all border-none cursor-pointer ${selectedId === cat.id ? 'ring-2 ring-p-500 ring-offset-2 shadow-lg' : 'shadow-sm'
                                    }`}
                                style={{
                                    background: selectedId === cat.id
                                        ? 'linear-gradient(135deg, var(--p-500), var(--p-700))'
                                        : 'white',
                                }}
                            >
                                <div style={{ color: selectedId === cat.id ? 'white' : '#64748b', transform: 'scale(1.2)' }}>
                                    {cat.icon}
                                </div>
                                <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                            </motion.button>

                            {/* Name Label */}
                            <span style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: selectedId === cat.id ? 'var(--p-600)' : 'var(--text-secondary)',
                                letterSpacing: '-0.2px'
                            }}>
                                {cat.name}
                            </span>

                            {selectedId === cat.id && (
                                <motion.div
                                    layoutId="activeDotGrid"
                                    className="w-1 h-1 rounded-full bg-p-600 mt-0.5"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryGrid;
