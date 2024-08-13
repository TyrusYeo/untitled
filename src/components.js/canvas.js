import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function DrawingCanvas({ savedDrawing }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(fabricCanvas);

    if (savedDrawing) {
      fabric.loadSVGFromString(savedDrawing, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        fabricCanvas.add(obj).renderAll();
      });
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleSave = async () => {
    if (canvas) {
      const svg = canvas.toSVG();
      // Save SVG to Supabase storage
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
      <button onClick={handleSave}>Save Drawing</button>
    </div>
  );
}