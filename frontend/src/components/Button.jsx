
export function Button({label, onClick, disabled = false, loading = false, variant = "primary"}) {
    const baseClasses = "w-full font-semibold rounded-lg text-sm px-5 py-3 transition-all duration-200 focus:outline-none focus:ring-4 transform hover:scale-[1.02] active:scale-[0.98]";
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-300 shadow-lg hover:shadow-xl",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-300 shadow-lg hover:shadow-xl"
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`;
    
    return <button 
        onClick={onClick} 
        type="button" 
        disabled={disabled || loading}
        className={classes}
    >
        {loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            </span>
        ) : label}
    </button>
}