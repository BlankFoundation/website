import { useCallback, useEffect, useRef, useState } from 'react';
import { parse }from 'svgson';
import { v4 as uuidv4 } from 'uuid';
import { TWButton } from '.';

const canvasDim = 300;
export const fullDim = 1000;

const CombineArt = ({ selectedArt, claiming, title=true }) => {
  const [scroll, setScroll] = useState(0);
  const [buttonText, setButtonText] = useState('Share in Discord');
  const svgMap = useRef({});

  const loadImages = useCallback(() => {
    if (claiming) return;

    const canvas = document.getElementById('canvas');
    canvas.width = canvasDim;
    canvas.height = canvasDim;

    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const selected of selectedArt) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      const existingImage = document.getElementById(`image-${selected.id}`);

      if (!existingImage || !existingImage.complete || existingImage.naturalHeight === 0) {
        setTimeout(loadImages, 500);
        return;
      }

      image.src = existingImage.src;
      image.onload = () => {
        ctx.drawImage(image,0,0, canvasDim, canvasDim);
      };
    }
  }, [selectedArt, claiming]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    setButtonText("Share in Discord")
  }, [selectedArt]);

  useEffect(() => { 
    const draw = () => {
      const fullDim = 1000
      const ids = selectedArt.map(({ id }) => id).join('-');
      if (svgMap.current.drawn?.[ids]) return;
      delete svgMap.current.drawn;
      svgMap.current.drawn = {[ids]: true};

      const combinedSvg = document.getElementById('combined-svg');  
      combinedSvg.innerHTML = '';
      combinedSvg.setAttribute('viewBox', `0 0 ${fullDim} ${fullDim}`);

      for (const selected of selectedArt) {
        const svgDom = new DOMParser().parseFromString(
          svgMap.current[selected.id], 
          'text/xml'
        ).getElementsByTagName('svg')[0];
        
        svgDom.setAttribute('height', fullDim);
        svgDom.setAttribute('width', fullDim);
        combinedSvg.appendChild(svgDom);
      }
    }

    const loadSvgInfo = async () => {
      let complete = true;
      for (const selected of selectedArt) {
        if (svgMap.current[selected.id]) continue;

        const existingImage = document.getElementById(`image-${selected.id}`);

        if (!existingImage?.src) {
          complete = false;
          setTimeout(loadSvgInfo, 500);
          return;
        }

        const response = await fetch(existingImage.src);
        let svgText = await response.text();

        const svgsonElement = await parse(svgText, {});
        const ids = collectIds(svgsonElement.children);
        const classes = collectClasses(svgsonElement.children);
       
        const idMap = generateIdMap(ids);
        const classMap = generateClassMap(classes);
        svgText = replaceClasses(replaceIds(svgText, idMap), classMap);

        svgMap.current = {
          ...svgMap.current,
          [selected.id]: svgText
        };
      }

      if (complete) {
        draw();
      }
    }

    loadSvgInfo();
  }, [selectedArt])

  const sendToDiscord = async () => {
    if (buttonText !== "Share in Discord") return;

    setButtonText('Sharing...')
    const canvas = document.getElementById('canvas');

    const params = {
      username: "Birb Webhook",
      content: "A new full Birb has been shared!"
    }

    const request = new XMLHttpRequest();
    request.open("POST", process.env.NEXT_PUBLIC_DISCORD_WEBHOOK);

    const form = new FormData();
    form.append("payload_json", JSON.stringify(params));
    canvas.toBlob((blob) => {
      form.append('file1', blob, 'birb.png');
      request.send(form)
      setButtonText('Shared')
    }); 
  }

  return (
    <div className=''>
      {title && (
        <h3 className='mb-3'>Combined Layers</h3>
      )}
      <canvas 
        id='canvas' 
        className='absolute' 
        style={{width: `${canvasDim}px`, height: `${canvasDim}px`, top: '-99999px', left: '-99999px'}}>  
      </canvas>
      <svg 
        id="combined-svg" 
        className='border'
        style={{width: `${canvasDim}px`, height: `${canvasDim}px`}}
      ></svg>       
      {false && selectedArt.length > 0 && (
        <div className='mt-3 text-center'>
          <TWButton
            onClick={sendToDiscord}
          >
            {buttonText}
          </TWButton>

        </div> 
      )}
    </div>
  )
}

const collectIds = children => {
  let ids = [];
  children.forEach(child => {
    if (child.attributes.id && !ids.includes(child.attributes.id))
      ids.push(child.attributes.id);
    if (child.children) {
      ids = [...ids, ...collectIds(child.children)];
    }
  });
  return ids;
};

const collectClasses = children => {
  let classes = [];
  children.forEach(child => {
    if (child.attributes.class && !classes.includes(child.attributes.class))
      classes.push(child.attributes.class);
    if (child.children) {
      classes = [...classes, ...collectClasses(child.children)];
    }
  });
  return classes;
};

const generateIdMap = ids => {
  const idMap = {};
  ids.forEach(id => {
    idMap[id] = uuidv4();
  });
  return idMap;
};

const generateClassMap = classes => {
  const classMap = {};
  classes.forEach(className => {
    classMap[className] = uuidv4();
  });
  return classMap;
};

String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

const replaceIds = (file, idMap) => {
  let newFile = file;
  Object.keys(idMap).forEach(
    id =>
      (newFile = newFile
        .replaceAll(`id="${id}"`, `id="${idMap[id]}"`)
        .replaceAll(`#${id}`, `#${idMap[id]}`))
  );
  return newFile;
};

const replaceClasses = (file, classMap) => {
  let newFile = file;
  Object.keys(classMap).forEach(
    className =>
      (newFile = newFile
        .replaceAll(`class="${className}"`, `class="${classMap[className]}"`)
        .replaceAll(`.${className}`, `.${classMap[className]}`))
  );
  return newFile;
};

export default CombineArt;
