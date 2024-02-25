import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * A label displayed
   */
  label?: string;
  /**
   * Size
   */
  size?: "large" | "small";
  /**
   * Color
   */
  backgroundColor?: { control: string };
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, children, ...p }: ButtonProps) => {
  return (
    <button
      type="button"
      style={{ backgroundColor: primary ? "blue" : "" }}
      {...p}
    >
      {children}
    </button>
  );
};
