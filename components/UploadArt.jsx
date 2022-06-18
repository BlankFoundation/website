import { useState } from 'react';
import {
  TWButton,
} from '.'
import supabaseClient from '../lib/supabaseClient';

const canvasDim = 300;

const UploadArt = ({ collection, wallet, onUpload }) => {
  const [file, setFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const imageUri = (id) => `${collection.title}/${id}.svg`

  const sendToDiscord = async (id) => {
    const canvasClone = document.getElementById('canvas').cloneNode(true);

    const ctx = canvasClone.getContext('2d');
    
    ctx.clearRect(0, 0, canvasClone.width, canvasClone.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasClone.width, canvasClone.height);

    const loadAndSendImage = () => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      const existingImage = document.getElementById(`image-${id}`);
  
      if (!existingImage || !existingImage.complete || existingImage.naturalHeight === 0) {
        setTimeout(loadAndSendImage, 500);
        return;
      }
  
      image.src = existingImage.src;
      image.onload = () => {
        ctx.drawImage(image,0,0, canvasDim, canvasDim);

        const params = {
          username: "Birb Webhook",
          content: collection.title === 'Full Artwork' ? 
            "A new full image has been added!" : 
            "A new layer has been added!"
        }
  
        const request = new XMLHttpRequest();
        request.open("POST", process.env.NEXT_PUBLIC_DISCORD_WEBHOOK);
  
        const form = new FormData();
        form.append("payload_json", JSON.stringify(params));
        canvasClone.toBlob((blob) => {
          form.append('file1', blob, `birb-layer-${id}.png`);
          request.send(form)
        });   
      };    
    }

    loadAndSendImage();
  }

  const submit = async () => {
    if (!file || !wallet) return;

    const insert = async () => {
      const { body, error } = await supabaseClient
        .from('art')
        .insert({
          collection_id: collection.id,
          wallet: wallet
        })

      if (error) console.log("INSERT ERROR", error)

      return body[0] 
    }

    const storage = async (id) => {
      const { data, error } = await supabaseClient
      .storage
        .from('art')
        .upload(imageUri(id), file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) console.log("STORAGE ERROR", error)

      return data.Key
    }
    
    const artItem = await insert();
    await storage(artItem.id);

    document.getElementById('upload-file').value = null;

    setShowSuccessMessage(true)

    setTimeout(() => {
      sendToDiscord(artItem.id)
    }, 1000);
      
    onUpload(artItem)
  }

  return (
  <div className='border bg-green-100 p-3'>
      <p>Upload SVG Art</p>
      <p className='text-xs py-3'>Please make sure your image is an SVG file.</p>
      <input
        type='file'
        id='upload-file'
        className='mr-3'
        onChange={(e) => {
          setShowSuccessMessage(false)
          setFile(e.target.files[0])
        }}
      />
      <div className='pt-3'>
        <TWButton
          onClick={submit}
        >
          Submit
        </TWButton>
      </div>
      {showSuccessMessage && (
        <div className='pt-3 text-xs'>
          Your art has been successfully uploaded!          
        </div>
      )}
    </div>
  )
}

export default UploadArt;