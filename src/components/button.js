"use client";

const Button = ({text, icon, onClick, disabled, className}) => {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className + " bg-black outline-none text-white rounded p-2 cursor-pointer hover:bg-gray-800 flex items-center justify-center"}
        >
            {icon}
            <span className="ml-2">{text}</span>
        </button>
      );
  };
  
  export default Button;
  