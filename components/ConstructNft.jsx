import { useEffect, useState } from 'react';
import store from 'store2';
import supabaseClient from '../lib/supabaseClient';
import { EvolutionLayers, CombineArt } from "."
import TWButton from './TWButton';

const ConstructNft = ({wallet, tokenId, collection, onComplete}) => {
  const collectionStore = store.namespace(`blank-evolution-collection-${collection.id}`);
  const _selected = (collectionStore('selected-layers') || []).filter(
    (id) => art.find((a) => a.id === id)
  )

  if (_selected.length === 0) {
    _selected.push('83ae67b3-e38d-4459-aef3-62773f0ef79c')
  }

  const [art, setArt] = useState(collection?.art || []);
  const [selected, setSelected] = useState(_selected);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false)
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const art = (collection?.art || [])
    const sortedArt = art.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )
    setArt(sortedArt)
  }, [collection?.art])

  const onSelect = (id) => {
    let _selected;
    if (selected.includes(id)) {
      _selected = selected.filter((_id) => _id !== id)
    } else {
      _selected = [...selected, id]
    }

    collectionStore('selected-layers', _selected);
    setSelected(_selected)
  }

  const onDelete = (id) => {
    const updatedArt = art.filter(
      (artItem) => artItem.id !== id
    )
    setArt(updatedArt)
  }

  const assignNft = async () => {
    setAssigning(true);

    const { body, error } = await supabaseClient
      .from('nft')
      .insert({
        info: {
          layers: selected,
          combinedLayers: selected.join(','),
          image: document.getElementById('combined-svg').innerHTML
        },
        wallet: wallet,
        token_id: tokenId
      })

    const canvas = document.getElementById('canvas');

    const params = {
      username: "Birb Webhook",
      content: "A new pending evolution!"
    }

    const request = new XMLHttpRequest();
    request.open("POST", process.env.NEXT_PUBLIC_DISCORD_WEBHOOK);

    const form = new FormData();
    form.append("payload_json", JSON.stringify(params));
    canvas.toBlob((blob) => {
      form.append('file1', blob, 'birb.png');
      request.send(form)
    }); 

    setAssigning(false)

    if (error) console.log("ASSIGN NFT ERROR", error)

    onComplete({
      [tokenId]: body[0]
    })
  }

  useEffect(() => {
    const checkClaimed = async () => {
      const { data, error } = await supabaseClient
        .from('nft')
        .select('*')
        .eq('info->>combinedLayers', selected.join(','))

      if (error) {
        console.log("Error checking claimed", error)
        return;
      }

      if (data.length > 0) {
        setClaimed(true)
      } else {
        setClaimed(false)
      }
    }

    checkClaimed();
  }, [selected])

  return (
    <div className='container mx-auto'>
      <div className='text-center mb-6'>
        <h2 className='text-lg mb-6'>Blank Evolution</h2>
        <p>Select which layers to include in NFT #{tokenId}</p>
      </div>

      <div className='flex gap-6'>
        <div className='py-6'>
          <CombineArt
            selectedArt={selected.map((id) => art.find((artItem) => artItem.id === id))}
            claiming={claiming}
          />
          <div className='flex justify-between p-3'>
            {claimed ? (
              <div>This NFT has already been claimed!</div>
            ) : (
              <>
                {assigning ? (
                  <div>Saving</div>
                ): (
                  <TWButton
                    onClick={assignNft}
                  >
                    Save
                  </TWButton>
                )}
              </>
            )}
            
            <TWButton
              classMap={{ background: 'bg-red-500' }}
              onClick={() => onComplete()}
            >
              Cancel
            </TWButton>
          </div>
        </div>
        <div className=''>
          <EvolutionLayers 
            collectionTitle={collection.title} 
            art={art}
            wallet={wallet}
            selected={selected}
            onSelect={onSelect}
            onReorder={setSelected}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default ConstructNft