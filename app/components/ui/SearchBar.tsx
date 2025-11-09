'use client';

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="flex items-center space-x-3 bg-white rounded-2xl shadow-sm px-5 py-4 border border-gray-100">
      <div className="flex items-center space-x-4 flex-1">
        {/* Location From */}
        <div className="flex items-center space-x-2 px-3">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-xs text-gray-500 font-medium">NEW YORK (JFK)</p>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* Location To */}
        <div className="flex items-center space-x-2 px-3">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
          </svg>
          <div>
            <p className="text-xs text-gray-500 font-medium">MUMBAI (BOM)</p>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* Date */}
        <div className="flex items-center space-x-2 px-3">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-xs text-gray-500 font-medium">29 JUN 2019</p>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* Travelers */}
        <div className="flex items-center space-x-2 px-3">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          <div>
            <p className="text-xs text-gray-500 font-medium">2 TRAVELER</p>
          </div>
        </div>
      </div>

      <button className="bg-[#D4A574] hover:bg-[#C9954A] text-white px-10 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm">
        SEARCH
      </button>
    </div>
  );
}
