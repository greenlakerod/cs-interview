import React from "react";
import { Button, ButtonProps, Menu, MenuItem, MenuItemProps, MenuProps, PopoverNext, PopoverNextProps } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export interface ButtonWithMenuProps {
  buttonProps?: ButtonProps;
  menuItems: MenuItemProps[];
  menuProps?: MenuProps;
  popoverProps?: PopoverNextProps;
  text: string;
}

const ButtonWithMenu: React.FC<ButtonWithMenuProps> = (props) => {
  const {
    buttonProps = { intent: "primary", size: "medium" },
    menuItems,
    menuProps,
    popoverProps,
    text,
  } = props;

  const menuContent = (
    <Menu {...menuProps} >
      {menuItems.map(menuItemProps => (
        <MenuItem {...menuItemProps} />
      ))}
    </Menu>
  );

  return (
    <PopoverNext content={menuContent} placement="bottom-start" {...popoverProps} >
      {/* <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontWeight: 600,
          cursor: "pointer",
          alignSelf: "flex-end",      
        }}
      >
        {text}
      </button> */}
      {/* <Button text={<div>{text}</div>} alignText="center" endIcon={"caret-down"} {...buttonProps} /> */}
      <Button alignText="center" endIcon={"caret-down"} {...buttonProps}>
        {text}
      </Button>
    </PopoverNext>
  );
};

export default ButtonWithMenu;