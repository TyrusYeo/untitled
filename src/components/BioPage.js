import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCircle, faDrawPolygon, faTextHeight, faImage, faPaintBrush, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import './BioPage.css'
import { supabase } from '../utils/supabaseClient';

export default function BioPage({ profile }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [showDrawingControls, setShowDrawingControls] = useState(false);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setCanvas(fabricCanvas);

    if (fabricCanvas){
      const loadExistingCanvas = async () => {
        const { data, error } = await supabase.storage
          .from('bio_canvas')
          .download(`${profile.uuid}.svg`);
       
        if (error) {
          console.error('Error downloading SVG:', error);
        } else {
          const svgText = await data.text();
          fabric.loadSVGFromString(svgText, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            fabricCanvas.add(obj).renderAll();
          });
        }
      };

      loadExistingCanvas();
    }

    fabricCanvas.on('selection:created', (e) => setActiveObject(e.target));
    fabricCanvas.on('selection:cleared', () => setActiveObject(null));
    console.log("active object", activeObject)
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
    setShowDrawingControls(!showDrawingControls);
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
    console.log("delete")
    console.log(activeObject)
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const handleSave = async () => {
    if (canvas) {
      const svg = canvas.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const fileName = `${profile.uuid}.svg`;
      console.log(fileName)
      const { data, error } = await supabase.storage
        .from('bio_canvas')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true,
        });
  
      if (error) {
        console.error('Error uploading SVG:', error);
      } else {
        console.log('SVG uploaded successfully:', data);
      }
    }
  };

  return (
    <div className="main">
      <canvas ref={canvasRef} className="canvas" />
      <div className="description">
        <h1>{profile.name}'s Profile</h1>
        <img src={profile.avatar_url} alt="Profile" className="avatar" />
        <div className="bio">
          <h2>About Me</h2>
          <p>{profile.bio}</p>
        </div>
      </div>
      <div className="controls">
        <button onClick={() => addShape('rectangle')}>
          <FontAwesomeIcon icon={faSquare} />
        </button>
        <button onClick={() => addShape('circle')}>
          <FontAwesomeIcon icon={faCircle} />
        </button>
        <button onClick={() => addShape('triangle')}>
          <FontAwesomeIcon icon={faDrawPolygon} />
        </button>
        <button onClick={addText}>
          <FontAwesomeIcon icon={faTextHeight} />
        </button>
        <input type="file" onChange={addImage} accept="image/*" style={{ display: 'none' }} id="upload-image" />
        <label htmlFor="upload-image">
          <FontAwesomeIcon icon={faImage} />
        </label>
        <button onClick={toggleDrawingMode}>
          <FontAwesomeIcon icon={faPaintBrush} />
        </button>
        {showDrawingControls && (
          <div className="color-palette">
          <input type="color" onChange={(e) => setDrawingColor(e.target.value)} defaultValue="#000000" />
          {/* <input type="range" min="1" max="50" defaultValue="5" onChange={(e) => setDrawingWidth(e.target.value)} /> */}
        </div>
        )}
        <button onClick={deleteSelectedObject} disabled={!activeObject}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </div>
    </div>
  );
}