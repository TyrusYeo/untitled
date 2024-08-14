import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function BioPage({ profile }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setCanvas(fabricCanvas);

    if (profile.drawing) {
      fabric.loadSVGFromString(profile.drawing, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        fabricCanvas.add(obj).renderAll();
      });
    }

    fabricCanvas.on('selection:created', (e) => setActiveObject(e.target));
    fabricCanvas.on('selection:cleared', () => setActiveObject(null));

    const handleResize = () => {
      fabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [profile.drawing]);

  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: 'red',
          left: 100,
          top: 100,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: 'green',
          left: 100,
          top: 100,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: 'blue',
          left: 100,
          top: 100,
        });
        break;
    }
    canvas.add(shape);
    canvas.renderAll();
  };

  const addText = () => {
    const text = new fabric.IText('Edit me', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fill: 'black',
      fontSize: 20,
    });
    canvas.add(text);
    canvas.renderAll();
  };

  const addImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleDrawingMode = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.renderAll();
  };

  const setDrawingColor = (color) => {
    canvas.freeDrawingBrush.color = color;
  };

  const setDrawingWidth = (width) => {
    canvas.freeDrawingBrush.width = parseInt(width);
  };

  const deleteSelectedObject = () => {
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const handleSave = async () => {
    if (canvas) {
      const svg = canvas.toSVG();
      // Save SVG to Supabase storage or wherever needed
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-auto" />
      <div className="absolute inset-0 z-20 pointer-events-none p-8">
        <h1 className="text-4xl font-bold mb-4">{profile.name}'s Profile</h1>
        <img src={profile.avatar_url} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
        <div className="bio">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p>{profile.bio}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-30 p-4 bg-white">
        <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
        <button onClick={() => addShape('triangle')}>Add Triangle</button>
        <button onClick={addText}>Add Text</button>
        <input type="file" onChange={addImage} accept="image/*" />
        <button onClick={toggleDrawingMode}>Toggle Drawing Mode</button>
        <input
          type="color"
          onChange={(e) => setDrawingColor(e.target.value)}
          defaultValue="#000000"
        />
        <input
          type="range"
          min="1"
          max="50"
          defaultValue="5"
          onChange={(e) => setDrawingWidth(e.target.value)}
        />
        <button onClick={deleteSelectedObject} disabled={!activeObject}>
          Delete Selected
        </button>
        <button onClick={handleSave}>Save Drawing</button>
      </div>
    </div>
  );
}