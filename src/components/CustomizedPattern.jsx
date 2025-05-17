import React, { useRef, useState, useEffect } from "react";
import { detectShape, drawDetectedShape } from "../utils/customPattern";

const CustomizedPattern = () => {
  const drawCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  // Handle mouse down event to start drawing
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  // Handle mouse move event to record points while drawing
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((prevPoints) => [...prevPoints, { x, y }]);
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Handle mouse up event to finish drawing and detect shape
  const handleMouseUp = () => {
    setIsDrawing(false);
    if (points.length > 2) {
      const detectedShape = detectShape(points);
      const ctx = outputCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, outputCanvasRef.current.width, outputCanvasRef.current.height);
      // Set background to white
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, outputCanvasRef.current.width, outputCanvasRef.current.height);
      drawDetectedShape(ctx, detectedShape);
    }
    // Clear drawing canvas for next input
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    setPoints([]);
  };

  // Initialize drawing canvas context
  useEffect(() => {
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.lineCap = "round";
    ctx.beginPath();

    // Set background to white
    const outputCtx = outputCanvasRef.current.getContext("2d");
    outputCtx.fillStyle = "white";
    outputCtx.fillRect(0, 0, outputCanvasRef.current.width, outputCanvasRef.current.height);
  }, []);

  return (
    <div>
      <h3>Customized Pattern</h3>
      <p>Draw a shape below. The detected shape will be drawn on the right canvas.</p>
      <div style={{ display: "flex", gap: "20px" }}>
        <canvas
          ref={drawCanvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid black", backgroundColor: "white" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <canvas
          ref={outputCanvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid black", backgroundColor: "white" }}
        />
      </div>
    </div>
  );
};

export default CustomizedPattern;
