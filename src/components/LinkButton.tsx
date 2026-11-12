import React, { AnchorHTMLAttributes } from "react";
import "./LinkButton.css";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <a onClick={onClick} {...props}>{children}</a>
  );
  // return (
  //   <button
  //     type={type}
  //     onClick={onClick}
  //     className={`inline p-0 font-inherit text-blue-600 underline hover:text-blue-800 disabled:text-gray-400 disabled:no-underline cursor-pointer bg-transparent border-none ${className}`}
  //     // className={`bg-transparent border-0 p-0 text-blue-600 underline cursor-pointer hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  //     {...props}
  //   >
  //     {children}
  //   </button>
  // );
};