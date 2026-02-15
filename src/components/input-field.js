"use client";

const InputField = ({text, type, placeholder, disabled, onChange, value}) => {

    return (
        <input
            type={type}
            placeholder={placeholder}  
            value={value}
            onChange={onChange}
            disabled={disabled} 
            className="outline-none border rounded p-2  bg-gray-50 border-gray-100 focus:border-black-300 flex items-center justify-center"
        />
      );
  };
  
  export default InputField;
  