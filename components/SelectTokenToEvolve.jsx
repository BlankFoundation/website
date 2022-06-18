import BlankButton from './BlankButton';
import { fullDim } from './CombineArt';
import supabaseClient from '../lib/supabaseClient';
import NextLink from './NextLink';

const dim = 150;

const SelectTokenToEvolve = ({tokenIds, lockedMap, nfts, onEvolve, onClear}) => {
  const clearNFT = async (tokenId) => {
    if (!confirm("Clear this claimed NFT?")) return;

    const { id } = nfts[tokenId];

    const response = await supabaseClient
      .from('nft')
      .delete()
      .eq('id', id);

    const _nfts = { ...nfts };
    delete _nfts[tokenId];
    onClear(_nfts);
  }
  
  return (
    <div>
      <div className='text-center mb-6'>
        <h2 className='text-lg mb-6'>Blank Evolution</h2>
        <p className='pb-3'>
          Click on one of your NFTs to evolve it. Click an evolved NFT to clear it.
        </p>
        <p className='pb-3'>
          And don&#39;t forget to 
          <NextLink 
            href='/collection/ebfef325-a747-4b50-83e1-8998e7abdb65' 
            passHref
          >
            <a className='pl-2 text-blue-600 underline'>
              upload your own art
            </a>
          </NextLink>
          !
        </p>
      </div>

      <div className='pl-24 pr-6 flex flex-wrap gap-3'>
        {tokenIds.map(
          (tokenId) => (
            <div 
              key={`token-${tokenId}`}
              className={`cursor-pointer border w-48 h-52 ${lockedMap[tokenId] ? 'bg-gray-300' : ''}`}
              onClick={nfts[tokenId] && (() => clearNFT(tokenId))}
            >
              <div className='pt-1 text-lg text-center font-bold'>
                {tokenId}
              </div>
              {lockedMap[tokenId] && (
                <div className='text-center pt-12'>
                  Locked
                </div>
              )}
              {!lockedMap[tokenId] && nfts[tokenId] && (
                <div className='p-3 bg-gray-600'>
                  <svg 
                    id='claim-svg' 
                    className='relative ml-2' 
                    width={dim}
                    height={dim}
                    viewBox={`0 0 ${fullDim} ${fullDim}`}
                    dangerouslySetInnerHTML={{ __html: nfts[tokenId].info.image }}
                  >  
                  </svg>
                </div>
              )}
              {!lockedMap[tokenId] && !nfts[tokenId] && (
                <div className='text-center'>
                  <BlankButton
                    classMap={{
                      background: "border-2 text-gray-700",
                      padding: "px-6 py-3 rounded-full",
                    }}
                    onClick={() => onEvolve(tokenId)}
                  >
                    Evolve
                  </BlankButton>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default SelectTokenToEvolve