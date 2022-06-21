import { useEffect, useState } from 'react';
import store from 'store2';

// import {
//   NextLink,
//   CombineArt
// } from '.'
// import supabaseClient from '../lib/supabaseClient';
import BirbExplanation from './BirbExplanation';
import CombineArt from './CombineArt';
import EvolutionLayers from './EvolutionLayers';
import NextLink from './NextLink';
// import ClaimNft from './ClaimNft';
// import TWButton from './TWButton';
import UploadArt from './UploadArt';
// import ViewAllNfts from './ViewAllNfts';

const EvolutionCollection = ({ collection, provider, wallet }) => { 
  const collectionStore = store.namespace(`blank-evolution-collection-${collection.id}`);

  const [art, setArt] = useState();
  // const [selected, setSelected] = useState((collectionStore('selected-layers') || []).filter(
  //   (id) => art.find((a) => a.id === id)
  // ));
  // const [claiming, setClaiming] = useState(false);
  // const [claimed, setClaimed] = useState(false)
  // const [viewAll, setViewAll] = useState(false);

  // useEffect(() => {
  //   const art = (collection?.art || [])
  //   const sortedArt = art.sort(
  //     (a, b) => new Date(a.created_at) - new Date(b.created_at)
  //   )
  //   setArt(sortedArt)
  // }, [collection?.art])

  // useEffect(() => {
  //   const checkClaimed = async () => {
  //     const { data, error } = await supabaseClient
  //       .from('nft')
  //       .select('*')
  //       .eq('info->>combinedLayers', selected.join(','))

  //     if (error) {
  //       console.log("Error checking claimed", error)
  //       return;
  //     }

  //     if (data.length > 0) {
  //       setClaimed(true)
  //     } else {
  //       setClaimed(false)
  //     }
  //   }

  //   checkClaimed();
  // }, [selected])

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

  const onUpload = (artItem) => {
    setArt([artItem])
  }

  if (!collection) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className='container mx-auto flex justify-center'>
      <div className='lg:w-2/3'>
        <div className='text-lg'>Upload Art</div>
          
        {wallet && collection.title === 'SVG Birbs' && (
          <div className=''>
            <div className='py-6'>
              <BirbExplanation />
            </div>
            <div className='py-6'>
              <UploadArt 
                collection={collection}
                wallet={wallet}
                onUpload={onUpload}
              />
            </div>

          </div>
        )}     

        {art && (
          <div className='absolute' style={{ top: -9999, left: -9999 }}>
            <EvolutionLayers 
              collectionTitle={collection.title} 
              art={art}
              wallet={wallet}
              selected={[]}
              onSelect={() => {}}
              onReorder={() => {}}
              onDelete={onDelete}
            />
          </div>
        )}

        {art && (
          <div>
            <CombineArt 
              selectedArt={art} 
              title={false}
            />
            <div className='pt-3'>
              Now use it to 
              <NextLink 
                href='/members' 
                passHref
              >
                <a className='ml-2 underline'>
                  create an NFT
                </a>
              </NextLink>!
            </div>
          </div>
        )}   
      </div>
    </div>
  )
}

export default EvolutionCollection;