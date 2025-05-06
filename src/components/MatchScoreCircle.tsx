import { useEffect, useRef } from 'react';

interface MatchScoreCircleProps {
  score: number; // Score from 0-100
  size?: number; // Size in pixels
}

const MatchScoreCircle = ({ score, size = 60 }: MatchScoreCircleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set higher resolution for better rendering
    const displaySize = size;
    const canvasSize = displaySize * 2;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    const radius = canvasSize * 0.4;
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const percentage = score; // Score is already a percentage (0-100)
    const startAngle = -0.5 * Math.PI; // Start at top
    const endAngle = (percentage / 100) * 2 * Math.PI + startAngle;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = canvasSize * 0.07; // Proportional line width
    ctx.strokeStyle = '#3f6e4f'; // Dark green/blue background
    ctx.stroke();

    // Determine color based on score
    const strokeColor = 
      score >= 90 ? '#50e281' : // Green for high score
      score >= 80 ? '#4299e1' : // Blue for medium score
      '#f7c32e';                // Yellow for lower score

    // Draw foreground circle (percentage)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = canvasSize * 0.07;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [score, size]);

  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <div className="relative w-full h-full">
        <canvas 
          ref={canvasRef} 
          className="rounded-full bg-gray-900"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          <span className="text-sm font-semibold">{score}
            <span className="absolute text-[8px] top-1 ml-0.5">%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchScoreCircle; 