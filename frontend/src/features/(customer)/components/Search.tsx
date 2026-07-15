'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar as CalendarIcon, Users, ChevronDown, Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState('2');
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('q', query);
        if (date) searchParams.set('date', date);
        if (guests) searchParams.set('guests', guests);
        
        router.push(`/restaurants?${searchParams.toString()}`);
    };

    const guestOptions = ['1 người', '2 người', '3 người', '4 người', '5 người', '6 người', '7-10 người', '10+ người'];

    return (
        <form 
            onSubmit={handleSearch}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0 bg-white/70 md:bg-[#f5efeb]/80 backdrop-blur-md border border-[#e3d9d3] rounded-3xl md:rounded-full p-2 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#d2c3b9]">
                
                {/* Location & Restaurant Search */}
                <div className="flex flex-1 items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-[#e3d9d3]/80">
                    <MapPin size={18} className="text-[#6f4e37] shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Địa điểm, nhà hàng..."
                        className="w-full bg-transparent text-sm text-[#3d2a21] placeholder-[#8c7a6f] focus:outline-none"
                    />
                </div>

                {/* Date Picker */}
                <div className="flex flex-1 items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-[#e3d9d3]/80 relative cursor-pointer">
                    <CalendarIcon size={18} className="text-[#6f4e37] shrink-0" />
                    <div className="flex flex-col w-full text-left">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-[#8c7a6f] block md:hidden">Ngày đặt</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent text-sm text-[#3d2a21] placeholder-[#8c7a6f] focus:outline-none cursor-pointer"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>
                </div>

                {/* Guests count */}
                <div className="flex flex-1 items-center justify-between gap-3 px-4 py-2 relative">
                    <div 
                        className="flex items-center gap-3 w-full cursor-pointer select-none"
                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                    >
                        <Users size={18} className="text-[#6f4e37] shrink-0" />
                        <div className="flex flex-col w-full text-left">
                            <span className="text-sm text-[#3d2a21] font-medium">
                                {guests.includes('người') ? guests : `${guests} người`}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`text-[#8c7a6f] transition-transform duration-200 ${isGuestDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isGuestDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsGuestDropdownOpen(false)}
                            />
                            <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-[#e3d9d3] rounded-2xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                                {guestOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setGuests(option);
                                            setIsGuestDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#3d2a21] hover:bg-[#f5efeb] hover:text-[#6f4e37] font-medium transition-colors"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Submit button */}
                <div className="p-1 md:p-0 flex justify-end shrink-0">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-[#543d31] hover:bg-[#3d2a21] text-white font-semibold text-sm px-8 py-3.5 rounded-2xl md:rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
                    >
                        <SearchIcon size={16} />
                        <span>Tìm kiếm</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Search;
