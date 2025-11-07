import { Link } from "react-router-dom";

export function BottomWarning({label, bottonText, to}) {
   return <div className="py-4 text-sm flex justify-center items-center gap-1 text-gray-600">
        <span>{label}</span>
        <Link 
            className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors cursor-pointer" 
            to={to}
        >
            {bottonText}
        </Link>
   </div>
}