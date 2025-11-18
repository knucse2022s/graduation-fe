import "./ToggleButton.css";

interface ToggleButtonProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleButton({ checked, onChange }: ToggleButtonProps) {
  return (
    <div className="toggle-container" onClick={onChange}>
      <div className={`toggle-button ${checked ? "checked" : ""}`} />
    </div>
  );
}
