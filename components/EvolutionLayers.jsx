import { useCallback, useEffect, useState } from 'react';
import supabaseClient from '../lib/supabaseClient';
import EvolutionLayer from "./EvolutionLayer";

const EvolutionLayers = ({ wallet, collectionTitle, art, selected, onSelect, onReorder, onDelete }) => {
  // const [starred, setStarred] = useState([]);
  const [orderedSelected, setOrderedSelected] = useState([])
  const [orderValues, setOrderValues] = useState(selected.map((_s, index) => index));
  const [selectedOrderType, setSelectedOrderType] = useState('Newest');
  const [signedUrls, setSignedUrl] = useState();

  // const loadStars = useCallback(async () => {
  //   if (!wallet) return;
    
  //   const { data, error } = await supabaseClient
  //     .from('star')
  //     .select('art_id')
  //     .eq('wallet', wallet)

  //   if (error) console.log("Error loading stars", error)

  //   const starIds = data.map(({ art_id }) => art_id);
  //   const _starred = art.filter(({ id }) => starIds.includes(id));
  //   setStarred(_starred)
  // }, [wallet, art])

  const reorderSelected = (id, index) => {
    const existingIndex = orderedSelected.indexOf(id);
    
    if (isNaN(index) || index === '' || index < 0 || index >= selected.length) {
      const newOrderValues = [...orderValues];
      newOrderValues[existingIndex] = index;  
      setOrderValues(newOrderValues);
      return false;
    }

    const _ordered = [...orderedSelected];
    _ordered.splice(existingIndex, 1);
    _ordered.splice(index, 0, id);
    setOrderValues(_ordered.map((_s, index) => index))
    console.log(_ordered)
    setOrderedSelected(_ordered);
    onReorder(_ordered);
    return true;
  }

  // useEffect(() => {
  //   loadStars();
  // }, [loadStars])

  useEffect(() => {
    setOrderedSelected(selected)
    setOrderValues(selected.map((_s, index) => index));
  }, [selected])

  useEffect(() => {
    const getSignedUrls = async () => {
      const imageUris = art.map((item) => `${collectionTitle}/${item.id}.svg`);

      const { data, error } = await supabaseClient
        .storage
        .from('art')
        .createSignedUrls(imageUris, 60 * 60 * 24 * 7)

      for (const signedUriInfo of data) {
        const artId = signedUriInfo.path.split('/').pop().split('.')[0];
        const signedArt = art.find((item) => item.id === artId)
        signedArt.signedUrl = signedUriInfo.signedURL;
      }

      if (error) {
        console.log("Error getting public URL", error)
        if (selected) onSelect(item.id)
        return
      }

      setSignedUrl(true)
    }

    getSignedUrls();
  }, [art, collectionTitle, selected, onSelect])

  if (!signedUrls) return <></>

  return (
    <div>
      {selected.length > 0 && (
        <div className='pb-6'>
          <h3 className='mb-3'>Selected Layers</h3>
          <div className='text-xs mb-3'>
            Edit the number under each layer to change the order. Click a layer to de-select it.
          </div>
          <div className="flex flex-wrap">
            {orderedSelected.map(
              (id) => art.find((artItem) => artItem.id === id)
            ).map(
              (selectedItem, index) => (
                <div key={`selected-${index}`}>
                  <EvolutionLayer                    
                    wallet={wallet}
                    art={selectedItem}
                    collectionTitle={collectionTitle}
                    selected={true}
                    // starred={starred.find(({ id }) => id === selectedItem.id)}
                    onSelect={onSelect}
                    // onStar={loadStars}
                    // onDelete={onDelete}
                  />
                  <div className='text-center'>
                    <input 
                      className='border w-9 text-gray-600 p-1 ' 
                      type='text' 
                      onChange={(e) => {
                        if (reorderSelected(selectedItem.id, e.target.value)) {
                          e.target.blur();
                        }
                      }}
                      value={orderValues[index] === undefined ? '' : orderValues[index]} 
                    />
                    {index === 0 && (
                      <div className='text-xs text-gray-600 mt-3'>
                        Bottom Layer
                      </div>
                    )}
                    {index === orderedSelected.length - 1 && (
                      <div className='text-xs text-gray-600 mt-3'>
                        Top Layer
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* {starred.length > 0 && (
        <div className='pb-6'>
          <h3 className='mb-3'>Starred Layers</h3>
          <div className="flex flex-wrap">
            {starred.map(
              (starredItem, index) => (
                <EvolutionLayer
                  key={`starred-${index}`}
                  wallet={wallet}
                  art={starredItem}
                  collectionTitle={collectionTitle}
                  selected={selected.includes(starredItem.id)}
                  starred={true}
                  onSelect={onSelect}
                  onStar={loadStars}
                  onDelete={onDelete}
                />
              )
            )}
          </div>
        </div>
      )} */}

      
      <h3 className='mb-3'>All Layers</h3>
      <div className='flex justify-between pr-48'>
        <div className='text-xs mb-3'>
          Click a layer to select it.
        </div>
        <div className=''>
          Order by: 
          {['Newest', 'Oldest'].map(
            (orderType, index) => (
              <span
                onClick={() => setSelectedOrderType(orderType)} 
                className={`cursor-pointer ml-3 ${selectedOrderType === orderType ? '' : 'text-blue-500 underline'}`}
                key={`order-type-${index}`}
              >
                {orderType}
              </span>
            )
          )}
        </div>
      </div>
      <div className='flex flex-wrap overflow-auto'>
        {art.sort(
          (a, b) => {
            if (selectedOrderType === 'Stars') {
              return (b.star_count || 0) - (a.star_count || 0);
            } else if (selectedOrderType === 'Oldest') {
              return new Date(a.created_at) - new Date(b.created_at);
            } else {
              return new Date(b.created_at) - new Date(a.created_at);
            }
          }
        ).map(
          (artItem, index) => (
            <EvolutionLayer 
              key={`layer-${index}`}
              wallet={wallet}
              art={artItem}
              collectionTitle={collectionTitle}
              selected={selected.includes(artItem.id)}
              // starred={starred.includes(artItem)}
              onSelect={onSelect}
              // onStar={loadStars}
              onDelete={onDelete}
            />
          )
        )}
      </div>
    </div>
  )

}

export default EvolutionLayers;