import SupabaseImage from "./SupabaseImage";

const ADMIN_WALLET = '0xfa23B55345c7237b7eEE52Db975E8a72b840BC1A';

const EvolutionLayer = ({ signedUrl, wallet, collectionTitle, art, selected, starred, onSelect, onStar, onDelete }) => {
  return (
    <div 
      key={`art-${art.id}`} 
      id={`art-${art.id}`} 
      className='mr-3 mb-3'
    >
      <SupabaseImage
        collectionTitle={collectionTitle}
        item={art}
        dim={150}
        wallet={wallet}
        ownerAdmin={onDelete && wallet === art.wallet || wallet === ADMIN_WALLET}
        selected={selected}
        starred={starred}
        onSelect={onSelect}
        onStar={onStar}
        onDelete={onDelete}
      />
    </div>
  )
}

export default EvolutionLayer;