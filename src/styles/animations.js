import { keyframes } from "@mui/system";

export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const wave = keyframes`
  0% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.5); }
`;

export const recordingPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 105, 180, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); }
`; 
