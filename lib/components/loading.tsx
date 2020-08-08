import React from 'react'

import Typography from '@material-ui/core/Typography'

import { ObjectOf } from '../types'

export interface LoadingProps {
  imageStyle?: ObjectOf<string>
  textStyle?: ObjectOf<string>
  size?: number
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({
  imageStyle,
  text,
  size,
  textStyle,
}) => {
  return (
    <>
      <img
        id="coin"
        src="../static/coin.svg"
        alt="coin"
        style={{ width: `${size}px`, ...imageStyle }}
      />
      {text && (
        <Typography
          variant="h3"
          gutterBottom
          style={{ textAlign: 'center', ...textStyle }}
        >
          {text}
        </Typography>
      )}

      <style>{`
        @keyframes rotation {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(1800deg);
          }
        }

        #coin {
          animation: rotation 2s infinite ease-in-out;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </>
  )
}

export const LoadingScreen = (props?: LoadingProps) => (
  <Loading
    imageStyle={{ marginTop: '20vh', width: '60vw' }}
    text="Loading..."
    textStyle={{ marginTop: '10vh' }}
    {...props}
  />
)

export default Loading
