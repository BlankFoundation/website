import { useState } from 'react'
// import BigBangStarField from 'react-big-bang-star-field'
import { useEffect } from 'react';
import {
  BlankFooter,
  BlankHeader,
  BlankMusic,
  TWFullScreen
} from '.'
import BlankButton from './BlankButton';
import NextLink from './NextLink';

const BlankLayout = ({ children }) => {
  // const [bigBang, setBigBang] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  
  // const showBigBang = (show) => {
  //   setBigBang(show)
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!signedIn && window.disconnectBlankWallet) {
        setSignedIn(true);
      } else if (signedIn && !window.disconnectBlankWallet) {
        setSignedIn(false);
      }
    }, 500)

    return () => clearInterval(interval)
  }, [signedIn])

  return (
    <TWFullScreen className='font-roboto-mono text-sm bg-white text-gray-900'>
      {/* <div className={`${bigBang ? '' : 'absolute -top-full'}`} onClick={() => showBigBang(!bigBang)}>
        <div className={`${bigBang ? 'opacity-100' : 'opacity-0'} bg-black absolute h-screen w-full transition-all duration-1000 ease-in-out`}>
          <div className='absolute pt-96 w-full text-center text-white text-4xl'>
            Blank Bang
          </div>
    
          {bigBang && 
            <BigBangStarField
              size={{ width: 100, height: 100 }}
              numStars={666}
              maxStarSpeed={1}
              scale={4}
              style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%'
                }}
              starColor={"255, 255, 255"}
            />
          }
        </div>
      </div> */}
      <BlankHeader>
        <div className='flex justify-between items-center gap-12'>
          {/* <BlankMusic
            onClick={showBigBang}
          /> */}
          <NextLink 
            href='/collection/ebfef325-a747-4b50-83e1-8998e7abdb65' 
            passHref
          >
            <a className=''>
              Upload Art
            </a>
          </NextLink>
          <NextLink 
            href='/gallery' 
            passHref
          >
            <a className=''>
              Gallery
            </a>
          </NextLink>
          <NextLink 
            href='/members' 
            passHref
          >
            <a className=''>
              My NFTs
            </a>
          </NextLink>
          <BlankButton
            classMap={{ padding: '0', margin: '0' }}
            onClick={signedIn ? (() => window.disconnectBlankWallet()) : null}
          >
            {signedIn ? (
              <span className='px-6 py-2 inline-block'>Disconnect</span>
            ) : (
              <NextLink 
                href='/members' 
                passHref
              >
                <a className='px-6 py-2 inline-block'>
                  Enter App
                </a>
              </NextLink>
            )}
          </BlankButton>
        </div>
      </BlankHeader>
      {children}
      <BlankFooter />
    </TWFullScreen>
  );
}

BlankLayout.defaultProps = {
  children: ['child1', 'child2', 'child3'].map(
    (child, index) => <div key={'child-' + index}>{child}</div>
  )
}

export default BlankLayout;
