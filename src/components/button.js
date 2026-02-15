"use client";

const Button = ({text, icon, onClick, disabled, className, loading}) => {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className + " bg-black outline-none text-white rounded disabled:opacity-50 disabled:cursor-not-allowed p-2 cursor-pointer hover:bg-gray-800 flex items-center justify-center"}
        >
            {
                loading ? 
                <div className="animate-spin h-4 w-4 border-4 border-gray-300 border-t-black rounded-full">
                </div>
                :
                icon    
            }
            <span className="ml-2">{text}</span>
        </button>
      );
  };
  
  export default Button;
  