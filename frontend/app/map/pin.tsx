import * as React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface PinProps {
  size?: number;
  color?: string;
}

const Pin: React.FC<PinProps> = React.memo(({ size = 32, color = "#d00" }) => (
  <div
    style={{
      transform: "translate(-50%, -100%)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <FaMapMarkerAlt size={size} color={color} />
  </div>
));

export default Pin;
