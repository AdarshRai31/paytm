export function InputBox({label, placeholder, onChange, type = "text", value, error}) {
    return <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <input 
            type={type}
            onChange={onChange} 
            placeholder={placeholder} 
            value={value}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
            }`}
        />
        {error && <div className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
        </div>}
    </div>
}