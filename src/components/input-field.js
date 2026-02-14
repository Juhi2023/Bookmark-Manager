"use client";

const InputField = ({text, type, placeholder, disabled, onChange, value}) => {

    return (
        <input
            type={type}
            placeholder={placeholder}  
            value={value}
            onChange={onChange}
            disabled={disabled} 
            className="outline-nonee border rounded p-2   flex items-center justify-center"
        />
      );
  };
  
  export default InputField;
  